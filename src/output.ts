import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as Debug from 'debug';
import { OutputOptions } from './definitions';

const PAGE_TEMPLATE = path.join(__dirname, './templates/template.hbs');
const INDEX_TEMPLATE = path.join(__dirname, './templates/index.hbs');
const SCRIPT_TEMPLATE = path.join(__dirname, './templates/embed-viewer.js');

const TITLE = 'Embed Viewer';

const debug = Debug('embed:viewer:output');

class Output {
  public title: string;
  public files: string[];
  public source: string;
  public target: string;

  constructor(protected options: OutputOptions = {} as OutputOptions) {
    this.title = 'Embed Viewer';
    this.files = options.files;
    this.source = options.source;
    this.target = options.target;
  }

  public compile() {
    for (const file of this.files) {
      const template = Handlebars.compile(fs.readFileSync(PAGE_TEMPLATE, 'utf-8'));
      const fp = path.join(this.source, file);
      const base64 = fs.readFileSync(fp, {encoding: 'base64'});
      const compiled = template({ title: TITLE, base64 });
      const arr = file.includes('/') ? file.split('/') : file;
      const fullname = arr[arr.length - 1];
      const name = fullname.includes('.') ? fullname.split('.')[0] : fullname;
      const page = path.join(this.target, `/${name}.html`);
      debug('create page %s', page);
      fs.writeFileSync(page, compiled);
    }
  }

  public compileIndex(list?: string[]) {
    const template = Handlebars.compile(fs.readFileSync(INDEX_TEMPLATE, 'utf-8'));
    const compiled = template({ title: TITLE, files: list || this.files });
    fs.writeFileSync(path.join(this.options.target, '/index.html'), compiled);
  }

  public createScript() {
    const dest = path.join(this.target, '/embed-viewer.js');
    if (fs.existsSync(dest)) {
      debug('skip to create script %s', dest);
      return null;
    }
    debug('prepare to create %s into destination %s', SCRIPT_TEMPLATE, dest);
    fs.createReadStream(SCRIPT_TEMPLATE).pipe(fs.createWriteStream(dest))
      .on('finish', () => debug('script %s created', dest))
      .on('error', err => {
        debug('creat script %s error', dest);
        debug(err);
      });
  }
}

export default Output;