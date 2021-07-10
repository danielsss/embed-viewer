import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as Debug from 'debug';
import * as utils from './utils';
import * as _ from 'lodash';
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

  public purge() {
    debug('purge %s', this.target);
    if (!fs.existsSync(this.target)) {
      fs.mkdirSync(this.target);
      return null;
    }
    fs.rmdirSync(this.target, { recursive: true });
    fs.mkdirSync(this.target);
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
    const files = [];
    for (const str of (list || this.files)) {
      files.push(utils.resolvePathString(str));
    }
    const html = this.navigator(_.groupBy(files, file => file.dir.join('/')));
    debug('navigator html string:', html);
    const compiled = template({ title: TITLE, files: html });
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

  protected navigator(groupInfo): string {
    let html = '';

    const keys = Object.keys(groupInfo);
    const ul = ['<ul>', '</ul>'];
    const li = ['<li>', '</li>']
    for (const key of keys) {
      html += ul[0];
      html += `${li[0]}${key}${li[1]}`;
      if (groupInfo[key].length > 0) {
        html += ul[0];
        for (const obj of groupInfo[key]) {
          const href = obj.name.replace('.xmind', '.html');
          const name = obj.name.split('.')[0];
          html += `${li[0]}<a href="${href}">${name}</a>${li[1]}`;
        }
        html += ul[1];
      }
      html += ul[1];
    }

    return html;
  }
}

export default Output;