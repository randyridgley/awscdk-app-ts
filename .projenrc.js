const { cdk } = require('projen');

const project = new cdk.JsiiProject({
  defaultReleaseBranch: 'main',
  name: '@randyridgley/cdk-app-ts',
  packageName: '@randyridgley/cdk-app-ts',
  description: 'projen starter for @randyridgley/cdk projects.',
  author: 'randy.ridgley@gmail.com',
  repositoryUrl: 'https://github.com/randyridgley/cdk-app-ts/',
  npmDistTag: 'latest',

  releaseToNpm: true,

  deps: [
    'aws-cdk-lib@2.40.0',
    'constructs@10.1.94',
  ],

  devDeps: [
    'projen@0.61.41',
  ],

  peerDeps: [
    'projen',
  ],

  bundledDeps: [
    'aws-cdk@2.40.0',
  ],
});

project.tsconfigDev.addInclude('sample');


// Ensure we ignore 'tmp' (which the integration test outputs).
project.tasks.tryFind('release').prependExec('rm -rf tmp', { name: 'clean-test-dir' });
project.addGitIgnore('tmp/');

project.synth();