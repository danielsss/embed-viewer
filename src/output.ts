import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as Debug from 'debug';
import * as utils from './utils';
import * as _ from 'lodash';
import * as chalk from 'chalk';

import { TITLE, LOGO_ADDR } from './config';
import { OutputOptions, Properties } from './definitions';

const json = require('../package.json');

const PAGE_TEMPLATE = path.join(__dirname, './templates/template.hbs');
const INDEX_TEMPLATE = path.join(__dirname, './templates/index.hbs');
const SCRIPT_TEMPLATE = path.join(__dirname, './templates/embed-viewer.js');

const debug = Debug('embed:viewer:output');

class Output {
  public title: string;
  public files: string[];
  public struct: Properties[];
  public source: string;
  public target: string;
  public logo: string;

  constructor(protected options: OutputOptions) {
    if (!options || !options.files || !options.target || !options.source) {
      throw new Error('options object are required');
    }
    this.title = options.title || TITLE;
    this.files = options.files;
    this.struct = options.struct;
    this.source = options.source;
    this.target = options.target;
    this.logo = options.logo || LOGO_ADDR;
  }

  public purge() {
    debug('purge %s', this.target);
    if (!fs.existsSync(this.target)) {
      fs.mkdirSync(this.target, { recursive: true });
      return null;
    }
    fs.rmdirSync(this.target, { recursive: true });
    fs.mkdirSync(this.target, { recursive: true });
  }

  public compile() {
    const originalTemplate = fs.readFileSync(PAGE_TEMPLATE, 'utf-8');
    for (const file of this.files) {
      const template = Handlebars.compile(originalTemplate);
      const fp = path.join(this.source, file);
      const base64 = fs.readFileSync(fp, {encoding: 'base64'});
      const compiled = template({ title: this.title, base64, logo: LOGO_ADDR });
      const arr = file.includes('/') ? file.split('/') : [ file ];
      const fullname = arr[arr.length - 1];
      let name = undefined;
      if (fullname.includes('.')) {
        const parts = fullname.split('.');
        name = parts.slice(0, parts.length - 1).join('.');
      } else {
        name = fullname;
      }
      const page = path.join(this.target, `/${name}.html`);
      debug('create page %s', page);
      fs.writeFileSync(page, compiled);
      console.info('page %s is created', chalk.green(page));
    }
  }

  public compileIndex() {
    const template = Handlebars.compile(fs.readFileSync(INDEX_TEMPLATE, 'utf-8'));
    const files = [];
    debug('files:', this.files);
    for (const str of this.files) {
      files.push(utils.resolvePathString(str));
    }
    const html = this.navigator(_.groupBy(files, file => file.dir.join('/')));
    debug('navigator html string:', html);
    const compiled = template({
      title: this.title, html,
      git: json.homepage, logo: LOGO_ADDR,
      struct: JSON.stringify(this.struct)
    });
    fs.writeFileSync(path.join(this.options.target, '/index.html'), compiled);
    console.info('page %s is created', chalk.green('index.html'));
  }

  public createScript(exit: boolean = false) {
    const dest = path.join(this.target, '/embed-viewer.js');
    if (fs.existsSync(dest)) {
      debug('skip to create script %s', dest);
      return null;
    }
    debug('prepare to create %s into destination %s', SCRIPT_TEMPLATE, dest);
    const finish = () => {
      debug('script %s created', dest);
      console.info('script %s is created.', chalk.green(SCRIPT_TEMPLATE))
      exit && process.exit(0);
    }
    const error = err => {
      /* istanbul ignore next */
      debug('creat script %s error \n%o', dest, err);
      /* istanbul ignore next */
      exit && process.exit(1);
    }
    fs.createReadStream(SCRIPT_TEMPLATE)
      .pipe(fs.createWriteStream(dest))
      .on('finish', finish)
      .on('error', error);
  }

  protected navigator(groupInfo): string {
    let html = '';

    const keys = Object.keys(groupInfo);
    const folderStyle = 'uk-list';
    const fileStyle = 'uk-list uk-list-disc uk-list-primary';
    const ul = ['<ul class="{style}">', '</ul>'];
    const li = ['<li>', '</li>']
    const folder = '<span uk-icon="icon: folder" style="margin-right: 10px;"></span>'
    for (const key of keys) {
      html += ul[0].replace('{style}', folderStyle);
      html += `${li[0]}${folder}${key}${li[1]}`;
      if (groupInfo[key].length > 0) {
        html += ul[0].replace('{style}', fileStyle);
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