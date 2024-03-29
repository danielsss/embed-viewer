#!/usr/bin/env node

import * as path from 'path';
import * as chalk from 'chalk';
import Input from '../input';
import Output from '../output';
import { Command } from 'commander';

const packages = require('../../package.json');
const debug = require('debug')('embed:bin:viewer');
const program = new Command();

program
  .name('viewer')
  .description('This tool is used for converting "*.xmind" file to Gitlab pages')
  .usage('-i . -o ./docs/pages -f -e node_modules,src,...')
  .option('-t, --title <value>', 'specify the page title', 'Embed Viewer')
  .option('-i, --input <value>', 'the "*.xmind" source folder')
  .option('-o, --output <value>', 'the output folder where the converted pages are stored')
  .option('-p, --purge', 'purge the target folder before output pages')
  .option('-e, --excludes <value>', 'specify folder that will excluded during the process of scanning', 'node_modules')
  .option('-l, --logo <value>', 'specify the logo address')
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
const struct = input.getStruct();
const outputOptions = { source, target, files, title: options.title, struct };

if (options.logo && typeof options.logo === 'string') {
  if (!options.logo.startsWith('http://') && !options.logo.startsWith('https://')) {
    program.addHelpText('afterAll', 'The logo address must start with "http://" or "https://"');
    program.help();
    process.exit(1);
  }

  outputOptions['logo'] = options.logo;
}

const output = new Output(outputOptions);

if (Array.isArray(files) && files.length > 0) {
  try {
    if (options.purge) {
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
  console.info('> %s', chalk.green('No detected maps'))
  process.exit(0);
}
