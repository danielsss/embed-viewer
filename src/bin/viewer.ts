#!/usr/bin/env node

import * as path from 'path';
import * as Debug from 'debug';
import Input from '../input';
import Output from '../output';
import { Command } from 'commander';

const packages = require('../../package.json');

const debug = Debug('embed:bin:viewer');
const program = new Command();

program
  .name('viewer')
  .description('This tool is used for converting "*.xmind" file to Gitlab pages')
  .usage('-i . -o ./docs/pages -f -e node_modules,src,...')
  .option('-i, --input <value>', 'The "*.xmind" source folder')
  .option('-o, --output <value>', 'The output folder where the converted pages are stored')
  .option('-p, --purge', 'Purge the target folder before output pages')
  .option('-e, --excludes <value>', 'Specify folder that will excluded during the process of scanning')
  .version(packages.version)
  .parse();

if (process.argv.length <= 2) {
  program.help();
  process.exit(0);
}

const options = program.opts();

if (!options.input) {
  program.addHelpText('afterAll', '-i, --input is required');
  program.help();
  process.exit(1);
}

if (!options.output) {
  program.addHelpText('afterAll', '-o, --output is required');
  program.help();
  process.exit(1);
}


const source = path.resolve(options.input);
const target = path.resolve(options.output);

const excludes = options.excludes && typeof options.excludes === 'string' ?
  options.excludes.split(',') : null;
const input = new Input({ source, excludes });
const files = input.getLoadedFiles();
const output = new Output({ source, target, files });

if (Array.isArray(files) && files.length > 0) {
  try {
    if (options.purge) {
      output.purge();
    }
    output.compileIndex();
    output.compile();
    output.createScript(true);
  } catch (err) {
    debug('Occurs Unhandled Error');
    debug(err);
    debug('\n');
    debug('Commit your error to Github Issue: %s for improvement.', packages.bugs.url);
    process.exit(1);
  }

} else {
  debug('Not found any maps.')
  process.exit(0);
}
