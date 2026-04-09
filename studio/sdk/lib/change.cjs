'use strict';
const fs = require('fs');
const path = require('path');
const CHANGES_DIR = path.resolve('docs/changes');
const DOMAINS_DIR = path.resolve('docs/domains');

function readMetadata(dirPath) {
  const metaPath = path.join(dirPath, 'metadata.yaml');
  if (!fs.existsSync(metaPath)) return null;
  const content = fs.readFileSync(metaPath, 'utf8');
  const meta = {};
  for (const line of content.split('\n')) {
    const match = line.match(/^(\w[\w_]*?):\s*(.+)$/);
    if (match) {
      let val = match[2].trim();
      if (val === '[]') val = [];
      else if (val === '""' || val === "''") val = '';
      else if (val === 'true') val = true;
      else if (val === 'false') val = false;
      meta[match[1]] = val;
    }
  }
  return meta;
}

/**
 * Find the absolute directory path for a change by its ID.
 * CHG-XXXX  → docs/changes/CHG-XXXX/
 * DMNCHG-XXXX → docs/domains/{domain}/changes/DMNCHG-XXXX/
 */
function findPath(id) {
  if (id.startsWith('CHG-')) {
    const dir = path.join(CHANGES_DIR, id);
    return fs.existsSync(dir) ? dir : null;
  }
  if (id.startsWith('DMNCHG-')) {
    if (!fs.existsSync(DOMAINS_DIR)) return null;
    const domains = fs.readdirSync(DOMAINS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'));
    for (const domain of domains) {
      const dir = path.join(DOMAINS_DIR, domain.name, 'changes', id);
      if (fs.existsSync(dir)) return dir;
    }
    return null;
  }
  return null;
}

function isDomainChange(id) {
  return id.startsWith('DMNCHG-');
}

function getDomain(id) {
  if (!isDomainChange(id)) return null;
  const p = findPath(id);
  if (!p) return null;
  // path: docs/domains/{domain}/changes/DMNCHG-XXXX
  const parts = p.split(path.sep);
  const changesIdx = parts.lastIndexOf('changes');
  return changesIdx > 0 ? parts[changesIdx - 1] : null;
}

/** List all cross-domain CHG-* IDs */
function listCrossDomain() {
  if (!fs.existsSync(CHANGES_DIR)) return [];
  return fs.readdirSync(CHANGES_DIR)
    .filter(d => d.startsWith('CHG-') && fs.statSync(path.join(CHANGES_DIR, d)).isDirectory())
    .sort();
}

/** List all single-domain DMNCHG-* IDs */
function listDomainChanges() {
  if (!fs.existsSync(DOMAINS_DIR)) return [];
  const results = [];
  const domains = fs.readdirSync(DOMAINS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'));
  for (const domain of domains) {
    const changesDir = path.join(DOMAINS_DIR, domain.name, 'changes');
    if (!fs.existsSync(changesDir)) continue;
    const entries = fs.readdirSync(changesDir)
      .filter(d => d.startsWith('DMNCHG-') && fs.statSync(path.join(changesDir, d)).isDirectory());
    results.push(...entries);
  }
  return results.sort();
}

module.exports = {
  /**
   * List all change IDs (both CHG-* and DMNCHG-*).
   */
  list() {
    return [...listCrossDomain(), ...listDomainChanges()].sort();
  },

  /**
   * List active (not done) changes of both types.
   */
  listActive() {
    return this.list().filter(id => {
      const dir = findPath(id);
      if (!dir) return false;
      const meta = readMetadata(dir);
      return meta && meta.status !== 'done';
    });
  },

  /**
   * Return the next available ID for the given type.
   * @param {'chg'|'dmnchg'} type - 'chg' for CHG-XXXX, 'dmnchg' for DMNCHG-XXXX
   */
  nextId(type = 'chg') {
    const prefix = type === 'dmnchg' ? 'DMNCHG-' : 'CHG-';
    const existing = type === 'dmnchg' ? listDomainChanges() : listCrossDomain();
    if (existing.length === 0) return `${prefix}0001`;
    const last = existing[existing.length - 1];
    const num = parseInt(last.replace(prefix, ''), 10);
    return `${prefix}${String(num + 1).padStart(4, '0')}`;
  },

  /**
   * Resolve the directory path for a change ID.
   * Returns null if not found.
   */
  findPath,

  /**
   * Get the status field from metadata.yaml for a change.
   */
  getStatus(id) {
    const dir = findPath(id);
    if (!dir) return null;
    const meta = readMetadata(dir);
    return meta ? meta.status : null;
  },

  /**
   * Update the status field in metadata.yaml for a change.
   */
  setStatus(id, newStatus) {
    const dir = findPath(id);
    if (!dir) throw new Error(`${id} not found`);
    const metaPath = path.join(dir, 'metadata.yaml');
    if (!fs.existsSync(metaPath)) throw new Error(`${id} metadata.yaml not found`);
    let content = fs.readFileSync(metaPath, 'utf8');
    content = content.replace(/^status:\s*.+$/m, `status: ${newStatus}`);
    content = content.replace(/^updated:\s*.+$/m, `updated: ${new Date().toISOString().split('T')[0]}`);
    fs.writeFileSync(metaPath, content, 'utf8');
    return `${id} status → ${newStatus}`;
  },

  /**
   * Get the stage_log from metadata for a change.
   */
  getStageLog(id) {
    const dir = findPath(id);
    if (!dir) return null;
    const meta = readMetadata(dir);
    return meta ? (meta.stage_log || []) : null;
  },

  /**
   * Returns true if the ID is a single-domain change (DMNCHG-*).
   */
  isDomainChange,

  /**
   * For DMNCHG-* IDs, returns the domain name it belongs to.
   * Returns null for CHG-* or if not found.
   */
  getDomain
};
