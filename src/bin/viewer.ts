#!/usr/bin/env node

import * as path from 'path';
import Input from '../input';
import Output from '../output';
import { Command } from 'commander';

const packages = require('../../package.json');


const program = new Command();

program
  .name('viewer')
  .description('This tool is used for converting "*.xmind" file to Gitlab pages')
  .usage('-i . -o ./docs/pages')
  .option('-i, --input <value>', 'The "*.xmind" source directory')
  .option('-o, --output <value>', 'The output directory where the converted pages are stored')
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
  output.compileIndex(input.files);
  output.compile();
  output.createScript();
}
