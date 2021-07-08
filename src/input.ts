import * as fs from 'fs';
import * as path from 'path';
import * as Debug from 'debug';
import { InputOptions } from './definitions';

const EXT = '.xmind';
const debug = Debug('embed:viewer:input');

class Input {
  public files;
  public excludes: string[];

  constructor(protected options: InputOptions = {} as InputOptions) {
    this.options = options;
    if (options.hasOwnProperty('nonStartsWithDot')) {
      this.options.nonStartsWithDot = options.nonStartsWithDot;
    } else {
      this.options.nonStartsWithDot = true;
    }
    this.excludes = this.options.excludes ? this.options.excludes : [ 'node_modules' ];
    this.files = this.getFiles();
  }

  private getFiles(sub?: string) {
    sub = sub || '';
    const base = this.options.source;
    const files = [];
    const unfiltered = fs.readdirSync(path.join(base, sub || ''), { withFileTypes: true });
    const filtered = unfiltered.filter(dir => !this.excludes.includes(dir.name));
    for (const dirent of filtered) {
      if (this.options.nonStartsWithDot && dirent.name.startsWith('.')) {
        continue;
      }
      if (dirent.isDirectory()) {
        const p = path.join(sub, dirent.name);
        files.push(...this.getFiles(p));
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