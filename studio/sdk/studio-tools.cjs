#!/usr/bin/env node
'use strict';

const { resolve, join } = require('path');
const state = require('./lib/state.cjs');
const config = require('./lib/config.cjs');
const domain = require('./lib/domain.cjs');
const change = require('./lib/change.cjs');
const conflict = require('./lib/conflict.cjs');
const template = require('./lib/template.cjs');

const STUDIO_VERSION = '0.1.0';

const commands = {
  // State management
  'state:get': (args) => state.get(args[0]),
  'state:set': (args) => state.set(args[0], args[1]),
  'state:position': () => state.getPosition(),
  'state:update-position': (args) => state.updatePosition(args[0], args[1], args[2]),

  // Config
  'config:get': (args) => config.get(args[0]),
  'config:set': (args) => config.set(args[0], args[1]),
  'config:init': () => config.init(),

  // Domain operations
  'domain:list': () => domain.list(),
  'domain:exists': (args) => domain.exists(args[0]),
  'domain:files': (args) => domain.files(args[0]),
  'domain:validate': (args) => domain.validate(args[0]),

  // Change package operations
  'change:list': () => change.list(),
  'change:active': () => change.listActive(),
  'change:next-id': () => change.nextId(),
  'change:status': (args) => change.getStatus(args[0]),
  'change:set-status': (args) => change.setStatus(args[0], args[1]),
  'change:stage-log': (args) => change.getStageLog(args[0]),

  // Conflict detection
  'conflict:check': (args) => conflict.check(args[0]),
  'conflict:list': () => conflict.listAll(),

  // Template operations
  'template:scaffold-domain': (args) => template.scaffoldDomain(args[0]),
  'template:scaffold-change': (args) => template.scaffoldChange(args[0]),
  'template:scaffold-project': () => template.scaffoldProject(),

  // Meta
  'version': () => console.log(STUDIO_VERSION),
  'help': () => {
    console.log('studio-tools v' + STUDIO_VERSION);
    console.log('Commands:');
    Object.keys(commands).sort().forEach(cmd => console.log('  ' + cmd));
  }
};

// CLI entry
const [,, command, ...args] = process.argv;

if (!command || !commands[command]) {
  commands.help();
  process.exit(command ? 1 : 0);
} else {
  try {
    const result = commands[command](args);
    if (result !== undefined && result !== null) {
      console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error(`Error in ${command}: ${err.message}`);
    process.exit(1);
  }
}
