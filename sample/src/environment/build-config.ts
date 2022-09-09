import path from 'path';
import * as fs from 'fs'
import * as yaml from 'js-yaml';
import { Construct } from 'constructs';

export interface BuildConfig {
    readonly AWSAccountID : string;
    readonly AWSProfileName : string;
    readonly AWSProfileRegion : string;

    readonly App : string;
    readonly Environment : string;
    readonly Version : string;
    readonly Build : string;

    readonly Parameters: Parameters;
}

export interface Parameters {
    readonly TestParameter?: string;
}

export function ensureString(object: { [name: string]: any }, propName: string ): string {
    if(!object[propName] || object[propName].trim().length === 0)
        throw new Error(propName +" does not exist or is empty");

    return object[propName];
}

export function getConfig(app: Construct) {
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
            TestParameter: ensureString(unparsedEnv['Parameters'], 'TestParameter'),
        }
    };

    return buildConfig;
}