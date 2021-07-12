module.exports = {
  recursive: true,
  reporter: 'spec',
  require: ['ts-node/register', 'source-map-support/register'],
  spec: ['test/**/*.spec.ts'],
  exit: true
};