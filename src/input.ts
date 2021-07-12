import * as fs from 'fs';
import * as path from 'path';
import * as Debug from 'debug';
import { InputOptions } from './definitions';

const EXT = '.xmind';
const debug = Debug('embed:viewer:input');

class Input {
  protected files: string[];

  constructor(protected options: InputOptions = {} as InputOptions) {
    this.options = options;
    if (!options.source || typeof options.source !== 'string') {
      throw new Error('Specify a source folder for file loader and it must be a exist path string');
    }
    if (options.hasOwnProperty('nonStartsWithDot')) {
      this.options.nonStartsWithDot = options.nonStartsWithDot;
    } else {
      this.options.nonStartsWithDot = true;
    }
    this.options.excludes = this.options.excludes ? this.options.excludes : [ 'node_modules' ];
    debug('Input options: %j', this.options);
    this.files = this.loadFiles();
    debug('loaded:', this.files);
  }

  public getLoadedFiles(): string[] {
    return this.files;
  }

  public opts(): InputOptions {
    return this.options;
  }

  protected loadFiles(sub?: string): string[] {
    sub = sub || '';
    const base = this.options.source;
    const files = [];
    const unfiltered = fs.readdirSync(path.join(base, sub || ''), { withFileTypes: true });
    const filtered = unfiltered.filter(dir => !this.options.excludes.includes(dir.name));
    for (const dirent of filtered) {
      if (this.options.nonStartsWithDot && dirent.name.startsWith('.')) {
        continue;
      }
      if (dirent.isDirectory()) {
        const p = path.join(sub, dirent.name);
        files.push(...this.loadFiles(p));
      } else {
        if (!dirent.name.endsWith(EXT)) {
          debug('excluded %s', dirent.name);
          continue;
        }
        files.push(path.join(sub, dirent.name));
      }
    }

    return files;
  }
}


export default Input;