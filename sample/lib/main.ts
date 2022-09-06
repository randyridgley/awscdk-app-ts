import path from 'path';
import * as fs from 'fs'
import { App, Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { PipelineStack } from './stacks/pipeline-stack';
import { BuildConfig } from './environment/build-config';
const yaml = require('js-yaml');

const app = new App();

function ensureString(object: { [name: string]: any }, propName: string ): string {
    if(!object[propName] || object[propName].trim().length === 0)
        throw new Error(propName +" does not exist or is empty");

    return object[propName];
}

function getConfig() {
    let env = app.node.tryGetContext('config');
    if (!env)
        throw new Error("Context variable missing on CDK command. Pass in as `-c config=XXX`");

    let unparsedEnv = yaml.load(fs.readFileSync(path.resolve("./environments/"+env+".yaml"), "utf8"));

    let buildConfig: BuildConfig = {
        AWSAccountID: ensureString(unparsedEnv, 'AWSAccountID'),
        AWSProfileName: ensureString(unparsedEnv, 'AWSProfileName'),
        AWSProfileRegion: ensureString(unparsedEnv, 'AWSProfileRegion'),

        App: ensureString(unparsedEnv, 'App'),
        Version: ensureString(unparsedEnv, 'Version'),
        Environment: ensureString(unparsedEnv, 'Environment'),
        Build: ensureString(unparsedEnv, 'Build'),

        Parameters: {
            TestParmeter: ensureString(unparsedEnv['Parameters'], 'TestParameter'),
        }
    };

    return buildConfig;
}

let buildConfig: BuildConfig = getConfig();

let pipelineStackName = buildConfig.App + "-" + buildConfig.Environment + "-pipeline";
const pipelineStack = new PipelineStack(app, pipelineStackName, {
  env: {
      region: buildConfig.AWSProfileRegion,
      account: buildConfig.AWSAccountID
  },
}, buildConfig);

Aspects.of(pipelineStack).add(new AwsSolutionsChecks({ verbose: true }));

app.synth();