import Input from '../../src/input';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs';

describe('Input Unit Test', function () {
  it('initializing Input error', done => {
    try {
      new Input();
    } catch (err) {
      expect(err).to.be.an('error');
      done();
    }
  });

  it('should return an instance of Input correctly and including all *.xmind files', done => {
    const source = path.resolve('.')
    const input = new Input({ source });
    const options = input.opts();
    expect(options.excludes).to.include('node_modules');
    const files = input.getLoadedFiles();
    expect(files).to.be.an('array');

    for (const file of files) {
      expect(fs.existsSync(path.join(source, file))).to.be.true;
    }
    done();
  });
});