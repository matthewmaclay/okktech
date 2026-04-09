#!/usr/bin/env node
'use strict';

// Studio Prompt Guard
// PreToolUse hook for Task/Agent: detects potential prompt injection
// Advisory only — warns but does not block

const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const toolName = input.tool_name || '';

if (toolName !== 'Task' && toolName !== 'Agent') {
  process.exit(0);
}

const prompt = (input.tool_input && input.tool_input.prompt) || '';

// Injection patterns
const patterns = [
  /ignore\s+(previous|above|all)\s+instructions/i,
  /you\s+are\s+now\s+/i,
  /system\s*:\s*/i,
  /\bdo\s+not\s+follow\b/i,
  /override\s+(safety|rules|instructions)/i,
  /pretend\s+(you|to\s+be)/i,
  /jailbreak/i,
  /base64\s+decode/i
];

for (const pattern of patterns) {
  if (pattern.test(prompt)) {
    process.stderr.write(`\n⚠️ STUDIO PROMPT GUARD: Suspicious pattern detected in agent prompt: ${pattern.source}\nThis is advisory — review the prompt if unexpected.\n`);
    break;
  }
}

process.exit(0);
