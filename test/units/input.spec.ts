import Input from '../../src/input';
import { expect } from 'chai';
import * as path from 'path';

describe('Input Unit Test', function () {
  it('initializing Input error', done => {
    try {
      new Input();
    } catch (err) {
      expect(err).to.be.an('error');
      done();
    }
  });

  it('should return an instance of Input correctly', done => {
    const input = new Input({ source: path.resolve('.') });
    const options = input.opts();
    expect(options.excludes).to.include('node_modules');
    expect(input.getLoadedFiles()).to.be.an('array');
    done();
  });
});