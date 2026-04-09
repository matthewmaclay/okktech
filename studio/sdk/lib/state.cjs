'use strict';
const fs = require('fs');
const path = require('path');

const STATE_PATH = path.resolve('.planning/STATE.md');

function readState() {
  if (!fs.existsSync(STATE_PATH)) return {};
  const content = fs.readFileSync(STATE_PATH, 'utf8');
  const result = {};
  // Parse key: value pairs from markdown
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^##\s+(.+?):\s*(.+)$/);
    if (match) result[match[1].toLowerCase().replace(/\s+/g, '_')] = match[2].trim();
  }
  return result;
}

function writeState(data) {
  const dir = path.dirname(STATE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let content = '# Studio State\n\n';
  for (const [key, value] of Object.entries(data)) {
    const title = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    content += `## ${title}: ${value}\n`;
  }
  content += `\n## Last Updated: ${new Date().toISOString()}\n`;
  fs.writeFileSync(STATE_PATH, content, 'utf8');
}

module.exports = {
  get(key) {
    const state = readState();
    return key ? state[key] : state;
  },
  set(key, value) {
    const state = readState();
    state[key] = value;
    writeState(state);
  },
  getPosition() {
    const state = readState();
    return {
      phase: state.current_phase || 'none',
      chg: state.current_chg || 'none',
      status: state.status || 'idle',
      last_activity: state.last_updated || 'never'
    };
  },
  updatePosition(chg, stage, actor) {
    const state = readState();
    state.current_chg = chg;
    state.current_phase = stage;
    state.current_actor = actor || state.current_actor || 'unknown';
    state.status = 'active';
    writeState(state);
  }
};
