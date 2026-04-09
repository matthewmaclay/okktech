#!/usr/bin/env node
'use strict';

// Studio Context Monitor
// PostToolUse hook: warns when context window is running low
// 35% = WARNING, 25% = CRITICAL

const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));

// Only check after significant operations
const significantTools = ['Read', 'Edit', 'Write', 'Agent', 'Bash'];
const toolName = input.tool_name || '';
if (!significantTools.some(t => toolName.startsWith(t))) {
  process.exit(0);
}

// Check session metrics if available
const sessionId = input.session_id || '';
const tmpFile = `/tmp/claude-ctx-${sessionId}.json`;

try {
  const fs = require('fs');
  if (fs.existsSync(tmpFile)) {
    const metrics = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    const remaining = metrics.remaining_pct || 100;

    if (remaining <= 25) {
      process.stderr.write(`\n⚠️ CRITICAL: Context window at ${remaining}%. Save state to STATE.md immediately and wrap up.\n`);
    } else if (remaining <= 35) {
      process.stderr.write(`\n⚠️ WARNING: Context window at ${remaining}%. Consider completing current stage soon.\n`);
    }
  }
} catch (e) {
  // Silently ignore - metrics may not be available
}

process.exit(0);
