const { cdk } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');

const project = new cdk.JsiiProject({
  defaultReleaseBranch: 'main',
  name: '@randyridgley/awscdk-app-ts',
  packageName: '@randyridgley/awscdk-app-ts',
  description: 'projen starter for @randyridgley cdk projects.',
  author: 'randy.ridgley@gmail.com',
  repositoryUrl: 'https://github.com/randyridgley/awscdk-app-ts/',

  npmDistTag: 'latest',
  npmAccess: NpmAccess.PUBLIC,
  releaseToNpm: true,
  deps: [
    'aws-cdk-lib@2.40.0',
    'constructs@10.1.94',
  ],

  devDeps: [
    'projen@0.61.45',
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
// project.tasks.tryFind('release').prependExec('rm -rf tmp', { name: 'clean-test-dir' });
project.addGitIgnore('tmp/');
project.addGitIgnore('test-reports/');
project.synth();
