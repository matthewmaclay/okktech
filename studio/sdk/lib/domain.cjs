'use strict';
const fs = require('fs');
const path = require('path');

const DOMAINS_DIR = path.resolve('docs/domains');
const REQUIRED_FILES = [
  'README.md', 'ubiquitous-language.md', 'aggregates.md',
  'business-rules.md', 'events.md', 'invariants.md',
  'integrations.md', 'ownership.md'
];

module.exports = {
  list() {
    if (!fs.existsSync(DOMAINS_DIR)) return [];
    return fs.readdirSync(DOMAINS_DIR)
      .filter(d => !d.startsWith('_') && !d.startsWith('.') && !d.endsWith('.md'))
      .filter(d => fs.statSync(path.join(DOMAINS_DIR, d)).isDirectory());
  },
  exists(name) {
    return fs.existsSync(path.join(DOMAINS_DIR, name, 'README.md'));
  },
  files(name) {
    const dir = path.join(DOMAINS_DIR, name);
    if (!fs.existsSync(dir)) return { exists: false };
    const existing = REQUIRED_FILES.filter(f => fs.existsSync(path.join(dir, f)));
    const missing = REQUIRED_FILES.filter(f => !fs.existsSync(path.join(dir, f)));
    return { exists: true, total: REQUIRED_FILES.length, existing, missing };
  },
  validate(name) {
    const info = this.files(name);
    if (!info.exists) return { valid: false, error: `Domain '${name}' not found` };
    const issues = [];
    if (info.missing.length > 0) issues.push(`Missing files: ${info.missing.join(', ')}`);
    // Check for placeholder content
    for (const file of info.existing) {
      const content = fs.readFileSync(path.join(DOMAINS_DIR, name, file), 'utf8');
      if (content.includes('CHG-XXXX') || content.includes('YYYY-MM-DD')) {
        issues.push(`${file} contains placeholder text`);
      }
    }
    return { valid: issues.length === 0, issues };
  }
};
