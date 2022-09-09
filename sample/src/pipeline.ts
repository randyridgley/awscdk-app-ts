import { App, Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import path from 'path';
import * as fs from 'fs'
import * as yaml from 'js-yaml';
import { BuildConfig, ensureString } from './environment/build-config';
import { CdkpipelinesDemoPipelineStack } from '../pipeline/cdkpipelines-demo-pipeline-stack';


const app = new App();

let unparsedEnv: any = yaml.load(fs.readFileSync(path.resolve("./environments/build-account.yaml"), "utf8"));

let buildConfig: BuildConfig = {
    AWSAccountID: ensureString(unparsedEnv, 'AWSAccountID'),
    AWSProfileName: ensureString(unparsedEnv, 'AWSProfileName'),
    AWSProfileRegion: ensureString(unparsedEnv, 'AWSProfileRegion'),

    App: ensureString(unparsedEnv, 'App'),
    Version: ensureString(unparsedEnv, 'Version'),
    Environment: ensureString(unparsedEnv, 'Environment'),
    Build: ensureString(unparsedEnv, 'Build'),

    Parameters: {
        TestParameter: ensureString(unparsedEnv['Parameters'], 'TestParameter'),
    }
};

let defaultStackName = buildConfig.App + "-" + buildConfig.Environment;
const pipelineStack = new CdkpipelinesDemoPipelineStack(app, defaultStackName, {
    env: {
        region: buildConfig.AWSProfileRegion,
        account: buildConfig.AWSAccountID
    },
}, buildConfig);

Aspects.of(pipelineStack).add(new AwsSolutionsChecks({ verbose: true }));

app.synth();