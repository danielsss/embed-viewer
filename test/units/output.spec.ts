import Input from '../../src/input';
import Output from '../../src/output';

import * as path from 'path';
import * as fs from 'fs';

import { expect } from 'chai';

describe('Output Unit Test', function () {
  let [output, options] = [null, null];
  it('should return an error object if options were not given', done => {
    try {
      // @ts-ignore
      new Output();
    } catch (err) {
      expect(err).to.be.an('error');
      done();
    }
  });

  it('should return an instance of Output', done => {
    options = {
      target: path.resolve('./.output'),
      source: path.resolve('.'),
      files: []
    }
    const input = new Input({ source: options.source, excludes: ['node_modules', 'src', 'docs', 'dist'] });
    options.files = input.getLoadedFiles();
    output = new Output(options);
    expect(output instanceof Output).to.be.true;
    done();
  });

  it('should purge the target folder before output new pages', done => {
    output.purge();
    expect(fs.readdirSync(options.target).length === 0).to.be.true;
    fs.rmdirSync(options.target, { recursive: true });
    output.purge();
    done();
  });

  it('should compile and output index pages', done => {
    output.compileIndex();
    expect(fs.readdirSync(options.target)).to.include('index.html');
    done();
  });

  it('should compile and output other pages', done => {
    output.compile();
    const files = fs.readdirSync(options.target);
    const filtered = files.filter(f => !f.startsWith('index'));
    for (const f of filtered) {
      expect(f.endsWith('html')).to.be.true;
    }
    done();
  });

  it('should compile and output js script', done => {
    output.createScript(false);
    expect(fs.readdirSync(options.target)).to.include('embed-viewer.js');
    output.createScript(false);
    done();
  });
});