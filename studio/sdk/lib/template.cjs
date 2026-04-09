'use strict';
const fs = require('fs');
const path = require('path');

// Resolve to the studio package's templates directory
function templatesDir() {
  // When installed globally: ~/.claude/studio/templates/
  // When running from source: ../templates/
  const candidates = [
    path.join(__dirname, '..', '..', 'templates'),
    path.join(process.env.HOME || '', '.claude', 'studio', 'templates')
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  throw new Error('Templates directory not found');
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

module.exports = {
  scaffoldDomain(name) {
    const src = path.join(templatesDir(), 'domain');
    const dest = path.resolve('docs', 'domains', name);
    if (fs.existsSync(dest)) throw new Error(`Domain '${name}' already exists`);
    copyDir(src, dest);
    return `Created docs/domains/${name}/ with ${fs.readdirSync(dest).length} files`;
  },

  /**
   * Scaffold a change package.
   * @param {string} id - Change ID (CHG-XXXX or DMNCHG-XXXX)
   * @param {string} [domain] - If provided, creates in docs/domains/{domain}/changes/{id}/
   *                             If omitted, creates in docs/changes/{id}/
   */
  scaffoldChange(id, domain) {
    const src = path.join(templatesDir(), 'change');
    let dest;
    if (domain) {
      dest = path.resolve('docs', 'domains', domain, 'changes', id);
    } else {
      dest = path.resolve('docs', 'changes', id);
    }
    if (fs.existsSync(dest)) throw new Error(`${id} already exists`);
    // Ensure parent directories exist
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    copyDir(src, dest);
    const relPath = path.relative(path.resolve('.'), dest);
    return `Created ${relPath}/ with ${fs.readdirSync(dest).length} files`;
  },

  scaffoldProject() {
    const tpl = templatesDir();
    const dirs = [
      'docs/_meta', 'docs/domains/_template', 'docs/changes/_template',
      'docs/contexts/backend', 'docs/contexts/frontend', 'docs/contexts/qa',
      'docs/contexts/analytics', 'docs/adrs', '.planning', '.claude/rules'
    ];
    const created = [];
    for (const dir of dirs) {
      const dest = path.resolve(dir);
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
        created.push(dir);
      }
    }
    // Copy domain template
    if (fs.existsSync(path.join(tpl, 'domain'))) {
      copyDir(path.join(tpl, 'domain'), path.resolve('docs/domains/_template'));
    }
    // Copy change template
    if (fs.existsSync(path.join(tpl, 'change'))) {
      copyDir(path.join(tpl, 'change'), path.resolve('docs/changes/_template'));
    }
    // Copy meta templates
    if (fs.existsSync(path.join(tpl, 'meta'))) {
      copyDir(path.join(tpl, 'meta'), path.resolve('docs/_meta'));
    }
    // Copy state template
    if (fs.existsSync(path.join(tpl, 'state.md'))) {
      const stateDest = path.resolve('.planning/STATE.md');
      if (!fs.existsSync(stateDest)) {
        fs.copyFileSync(path.join(tpl, 'state.md'), stateDest);
      }
    }
    // Copy config template
    if (fs.existsSync(path.join(tpl, 'config.json'))) {
      const configDest = path.resolve('.planning/config.json');
      if (!fs.existsSync(configDest)) {
        fs.copyFileSync(path.join(tpl, 'config.json'), configDest);
      }
    }
    return `Scaffolded project structure. Created: ${created.join(', ')}`;
  }
};
