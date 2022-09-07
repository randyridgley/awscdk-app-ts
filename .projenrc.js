const { cdk, javascript } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');

const project = new cdk.JsiiProject({
  defaultReleaseBranch: 'main',
  name: '@randyridgley/awscdk-app-ts',
  packageName: '@randyridgley/awscdk-app-ts',
  description: 'projen starter for @randyridgley cdk projects.',
  author: 'randy.ridgley@gmail.com',
  repositoryUrl: 'https://github.com/randyridgley/awscdk-app-ts/',

  npmDistTag: 'latest',
  npmRegistryUrl: 'https://npm.pkg.github.com',
  npmAccess: NpmAccess.PUBLIC,
  releaseToNpm: true,
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      singleQuote: true,
      trailingComma: javascript.TrailingComma.ALL,
    },
  },

  deps: ['aws-cdk-lib@2.40.0', 'constructs@10.1.94'],

  devDeps: ['projen@0.61.45'],

  peerDeps: ['projen'],

  bundledDeps: ['aws-cdk@2.40.0', '@randyridgley/cdk-constructs', 'cdk-monitoring-constructs@1.22.3', 'cdk-nag@2.18.2'],
});

project.tsconfigDev.addInclude('sample');

// Ensure we ignore 'tmp' (which the integration test outputs).
// project.tasks.tryFind('release').prependExec('rm -rf tmp', { name: 'clean-test-dir' });
project.addGitIgnore('tmp/');
project.addGitIgnore('test-reports/');
project.addGitIgnore('.DS_Store*');
project.synth();
