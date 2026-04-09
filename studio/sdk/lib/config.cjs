'use strict';
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.resolve('.planning/config.json');

const DEFAULTS = {
  version: '0.1.0',
  role: 'fullstack',
  model_profile: 'balanced',
  handoff_mode: 'branch',
  autonomous_allowed: false,
  obsidian_integration: true,
  language: 'ru',
  stage_pipeline: ['draft', 'discovery', 'spec', 'analysis', 'design', 'in-progress', 'done']
};

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return { ...DEFAULTS };
  try {
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) };
  } catch { return { ...DEFAULTS }; }
}

function writeConfig(data) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

module.exports = {
  get(key) {
    const cfg = readConfig();
    return key ? cfg[key] : cfg;
  },
  set(key, value) {
    const cfg = readConfig();
    cfg[key] = value;
    writeConfig(cfg);
  },
  init() {
    if (!fs.existsSync(CONFIG_PATH)) {
      writeConfig(DEFAULTS);
      return 'Created .planning/config.json with defaults';
    }
    return '.planning/config.json already exists';
  }
};
