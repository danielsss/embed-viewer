import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { OutputOptions } from './definitions';

const PAGE_TEMPLATE = path.join(__dirname, './templates/template.hbs');
const INDEX_TEMPLATE = path.join(__dirname, './templates/index.hbs');

class Output {
  public title: string;
  public files: string[];

  constructor(protected options: OutputOptions = {} as OutputOptions) {
    this.title = 'Embed Viewer';
    this.files = options.files;
  }

  public compile(context?: string) {
    const template = Handlebars.compile(fs.readFileSync(PAGE_TEMPLATE, 'utf-8'));
    const result = template({title: 'abc'});
    console.info(result);
  }

  public compileIndex(list?: string[]) {
    const template = Handlebars.compile(fs.readFileSync(INDEX_TEMPLATE, 'utf-8'));
    const result = template({ title: 'Embed Viewer', files: list || this.files });
    console.info('target:', path.join(this.options.target, '/index.html'));
    console.info(result);
    fs.writeFileSync(path.join(this.options.target, '/index.html'), result);
  }
}

export default Output;