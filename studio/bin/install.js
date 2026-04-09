#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const VERSION = require('../package.json').version;
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const HOME = os.homedir();
const CLAUDE_DIR = path.join(HOME, '.claude');
const STUDIO_DIR = path.join(CLAUDE_DIR, 'studio');
const SKILLS_DIR = path.join(CLAUDE_DIR, 'skills');
const SETTINGS_PATH = path.join(CLAUDE_DIR, 'settings.json');
const STUDIO_MARKER = '<!-- @okktech/studio -->';

// Parse args
const args = process.argv.slice(2);
const mode = args.includes('--help') || args.includes('-h') ? 'help'
           : args.includes('--uninstall') || args.includes('-u') ? 'uninstall'
           : args.includes('--init') ? 'init'
           : args.includes('--global') || args.includes('-g') || args.length === 0 ? 'global'
           : 'help';

if (mode === 'help') {
  console.log(`@okktech/studio v${VERSION}`);
  console.log('');
  console.log('Usage:');
  console.log('  okktech-studio                Install globally to ~/.claude/studio/');
  console.log('  okktech-studio --global       Same as above');
  console.log('  okktech-studio --init         Scaffold project structure in current directory');
  console.log('  okktech-studio --uninstall    Remove all studio files from ~/.claude/');
  console.log('  okktech-studio --help         Show this help');
  console.log('');
  console.log('After install:');
  console.log('  /studio-pm [feature]          Start new feature');
  console.log('  /studio-status                Check pipeline position');
  console.log('  /studio-feature [feature]     Full pipeline (PM→QA)');
  console.log('  /studio-onboard [path]        Onboard existing project');
  process.exit(0);
}

console.log(`@okktech/studio v${VERSION}`);
console.log(`Mode: ${mode}`);
console.log('');

// ============================================================================
// Utility functions
// ============================================================================

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ============================================================================
// Global install: copy assets to ~/.claude/studio/, register skills & hooks
// ============================================================================

function installGlobal() {
  console.log('Installing to ~/.claude/studio/ ...');

  // 1. Copy all asset directories
  const assetDirs = ['agents', 'commands', 'workflows', 'hooks', 'templates', 'references', 'sdk', 'rules'];
  for (const dir of assetDirs) {
    const src = path.join(PACKAGE_ROOT, dir);
    if (fs.existsSync(src)) {
      const dest = path.join(STUDIO_DIR, dir);
      copyDirSync(src, dest);
      console.log(`  ✓ ${dir}/`);
    }
  }

  // 2. Create SKILL.md files for each command
  const commandsDir = path.join(PACKAGE_ROOT, 'commands', 'studio');
  if (fs.existsSync(commandsDir)) {
    for (const file of fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'))) {
      const name = file.replace('.md', '');
      const skillDir = path.join(SKILLS_DIR, `studio-${name}`);
      if (!fs.existsSync(skillDir)) fs.mkdirSync(skillDir, { recursive: true });

      // Copy command file as SKILL.md
      fs.copyFileSync(
        path.join(commandsDir, file),
        path.join(skillDir, 'SKILL.md')
      );
      console.log(`  ✓ skill: /studio-${name}`);
    }
  }

  // 3. Register hooks in settings.json
  registerHooks();

  // 4. Make tools executable
  const toolsPath = path.join(STUDIO_DIR, 'sdk', 'studio-tools.cjs');
  if (fs.existsSync(toolsPath)) {
    fs.chmodSync(toolsPath, 0o755);
  }

  console.log('');
  console.log('✓ Installed @okktech/studio globally');
  console.log('');
  console.log('Next steps:');
  console.log('  cd your-project');
  console.log('  okktech-studio --init           # Scaffold project structure');
  console.log('  /studio-pm [feature description]  # Start working');
}

function registerHooks() {
  const settings = readJsonSafe(SETTINGS_PATH);
  if (!settings.hooks) settings.hooks = {};

  const studioHooks = {
    PreToolUse: [
      {
        matcher: 'Task',
        hooks: [{
          type: 'command',
          command: path.join(STUDIO_DIR, 'hooks', 'studio-prompt-guard.js')
        }]
      }
    ],
    PostToolUse: [
      {
        matcher: 'Write|Edit',
        hooks: [
          { type: 'command', command: path.join(STUDIO_DIR, 'hooks', 'studio-stage-gate.sh') },
          { type: 'command', command: path.join(STUDIO_DIR, 'hooks', 'studio-domain-guard.sh') },
          { type: 'command', command: path.join(STUDIO_DIR, 'hooks', 'studio-conflict-detect.sh') }
        ]
      },
      {
        matcher: '*',
        hooks: [
          { type: 'command', command: path.join(STUDIO_DIR, 'hooks', 'studio-context-monitor.js') }
        ]
      }
    ]
  };

  // Merge with existing hooks (don't overwrite)
  for (const [event, entries] of Object.entries(studioHooks)) {
    if (!settings.hooks[event]) settings.hooks[event] = [];

    // Remove old studio hooks (by path pattern)
    settings.hooks[event] = settings.hooks[event].filter(entry => {
      if (!entry.hooks) return true;
      return !entry.hooks.some(h => h.command && h.command.includes('studio/hooks/'));
    });

    // Add new studio hooks
    settings.hooks[event].push(...entries);
  }

  writeJson(SETTINGS_PATH, settings);
  console.log('  ✓ hooks registered in ~/.claude/settings.json');
}

// ============================================================================
// Project init: scaffold docs/ and .planning/
// ============================================================================

function initProject() {
  console.log('Scaffolding project structure...');

  // Use studio-tools template scaffolding
  const template = require(path.join(STUDIO_DIR, 'sdk', 'lib', 'template.cjs'));
  const result = template.scaffoldProject();
  console.log(`  ${result}`);

  // Create .claude/CLAUDE.md
  const claudeMd = path.resolve('.claude', 'CLAUDE.md');
  if (!fs.existsSync(path.dirname(claudeMd))) {
    fs.mkdirSync(path.dirname(claudeMd), { recursive: true });
  }
  if (!fs.existsSync(claudeMd)) {
    fs.writeFileSync(claudeMd, [
      '# Project Documentation',
      '',
      '## Framework',
      'This project uses @okktech/studio for documentation-driven development.',
      'See docs/_meta/doc-schema.md for pipeline documentation.',
      '',
      '## Quick start',
      '- `/studio-pm [feature]` — Start new feature',
      '- `/studio-status` — Check current position',
      '- `/studio-resume` — Resume where you left off',
      '',
      '## Rules',
      '@.claude/rules/docs-conventions.md',
      '@.claude/rules/change-management.md',
      '@.claude/rules/domain-conventions.md',
      ''
    ].join('\n'), 'utf8');
    console.log('  ✓ .claude/CLAUDE.md');
  }

  // Copy rules
  const rulesSource = path.join(STUDIO_DIR, 'rules');
  const rulesDest = path.resolve('.claude', 'rules');
  if (fs.existsSync(rulesSource)) {
    copyDirSync(rulesSource, rulesDest);
    console.log('  ✓ .claude/rules/');
  }

  console.log('');
  console.log('✓ Project initialized');
  console.log('');
  console.log('Open in Obsidian: docs/');
  console.log('Start working: /studio-pm [your feature idea]');
}

// ============================================================================
// Uninstall: remove studio files
// ============================================================================

function uninstall() {
  console.log('Uninstalling @okktech/studio...');

  // Remove studio directory
  if (fs.existsSync(STUDIO_DIR)) {
    fs.rmSync(STUDIO_DIR, { recursive: true });
    console.log('  ✓ Removed ~/.claude/studio/');
  }

  // Remove studio skills
  if (fs.existsSync(SKILLS_DIR)) {
    for (const dir of fs.readdirSync(SKILLS_DIR)) {
      if (dir.startsWith('studio-')) {
        fs.rmSync(path.join(SKILLS_DIR, dir), { recursive: true });
        console.log(`  ✓ Removed skill: ${dir}`);
      }
    }
  }

  // Remove studio hooks from settings.json
  if (fs.existsSync(SETTINGS_PATH)) {
    const settings = readJsonSafe(SETTINGS_PATH);
    if (settings.hooks) {
      for (const event of Object.keys(settings.hooks)) {
        settings.hooks[event] = settings.hooks[event].filter(entry => {
          if (!entry.hooks) return true;
          return !entry.hooks.some(h => h.command && h.command.includes('studio/hooks/'));
        });
      }
      writeJson(SETTINGS_PATH, settings);
      console.log('  ✓ Removed hooks from settings.json');
    }
  }

  console.log('');
  console.log('✓ @okktech/studio uninstalled');
}

// ============================================================================
// Main
// ============================================================================

switch (mode) {
  case 'global':
    installGlobal();
    break;
  case 'init':
    initProject();
    break;
  case 'uninstall':
    uninstall();
    break;
}
