'use strict';
const fs = require('fs');
const path = require('path');
const change = require('./change.cjs');

const CHANGES_DIR = path.resolve('docs/changes');

function getDomains(chgId) {
  const metaPath = path.join(CHANGES_DIR, chgId, 'metadata.yaml');
  if (!fs.existsSync(metaPath)) return [];
  const content = fs.readFileSync(metaPath, 'utf8');
  const match = content.match(/^domains:\s*\[(.+)\]/m);
  if (!match) return [];
  return match[1].split(',').map(d => d.trim().replace(/['"]/g, '')).filter(Boolean);
}

module.exports = {
  check(chgId) {
    const myDomains = getDomains(chgId);
    if (myDomains.length === 0) return { conflicts: [] };

    const active = change.listActive().filter(id => id !== chgId);
    const conflicts = [];

    for (const otherId of active) {
      const otherDomains = getDomains(otherId);
      const overlap = myDomains.filter(d => otherDomains.includes(d));
      if (overlap.length > 0) {
        conflicts.push({ chg: otherId, shared_domains: overlap });
      }
    }
    return { conflicts };
  },
  listAll() {
    const active = change.listActive();
    const allConflicts = [];
    const seen = new Set();

    for (const chgId of active) {
      const { conflicts } = this.check(chgId);
      for (const c of conflicts) {
        const key = [chgId, c.chg].sort().join(':');
        if (!seen.has(key)) {
          seen.add(key);
          allConflicts.push({ between: [chgId, c.chg], domains: c.shared_domains });
        }
      }
    }
    return allConflicts;
  }
};
