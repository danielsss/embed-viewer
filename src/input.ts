import * as fs from 'fs';
import * as path from 'path';
import * as Debug from 'debug';
import * as utils from './utils';
import { InputOptions, Properties, ResolvedFile } from './definitions';

const EXT = '.xmind';
const debug = Debug('embed:viewer:input');

class Input {
  protected struct: Properties[];
  protected files: ResolvedFile[] = [];

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
    // this.files = this.loadFiles();
    this.struct = this.deconstruct();
    debug('loaded: %j', this.struct);
  }

  public getLoadedFiles(): ResolvedFile[] {
    return this.files;
  }

  public getStruct(): Properties[] {
    return this.struct;
  }

  public opts(): InputOptions {
    return this.options;
  }

  protected deconstruct(sub?: string) {
    sub = sub || '';
    const base = this.options.source;
    const values = [];
    const unfiltered = fs.readdirSync(path.join(base, sub || ''), {withFileTypes: true});
    const filtered = unfiltered.filter(dir => !this.options.excludes.includes(dir.name));
    for (const dirent of filtered) {
      if (this.options.nonStartsWithDot && dirent.name.startsWith('.')) {
        continue;
      }

      if (dirent.isDirectory()) {
        const p = path.join(sub, dirent.name);
        const arr = this.deconstruct(p);
        if (Array.isArray(arr) && arr.length > 0) {
          values.push({isDir: true, name: dirent.name, hash: utils.hash(dirent.name), values: arr});
        }
      } else {
        if (!dirent.name.endsWith(EXT)) {
          continue;
        }
        const hash = utils.hash(dirent.name)
        values.push({isDir: false, isInclude: true, name: dirent.name, hash});
        this.files.push({relative: path.join(sub, `/${dirent.name}`), hash});
      }
    }
    return values;
  }
}


export default Input;