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
  .usage('-i . -o ./docs/pages')
  .option('-i, --input <value>', 'The "*.xmind" source directory')
  .option('-o, --output <value>', 'The output directory where the converted pages are stored')
  .option('-p, --purge', 'Purge the target directory before output pages')
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

const input = new Input({ source });
const output = new Output({ source, target, files: input.files });

if (Array.isArray(input.files) && input.files.length > 0) {
  try {
    if (options.parge) {
      output.purge();
    }
    output.compileIndex();
    output.compile();
    output.createScript();
    process.exit(0);
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
