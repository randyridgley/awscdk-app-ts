import { App, Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { DefaultStack } from './stacks/default-stack';
import { BuildConfig, getConfig } from './environment/build-config';

const app = new App();

let buildConfig: BuildConfig = getConfig(app);

let defaultStackName = buildConfig.App + "-" + buildConfig.Environment + "-default";
const defaultStack = new DefaultStack(app, defaultStackName, {
  env: {
      region: buildConfig.AWSProfileRegion,
      account: buildConfig.AWSAccountID
  },
}, buildConfig);

Aspects.of(defaultStack).add(new AwsSolutionsChecks({ verbose: true }));
app.synth();