
import { Aspects, CfnOutput, Stage, StageProps } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { Construct } from 'constructs';
import { BuildConfig, getConfig } from '../environment/build-config';
import { DefaultStack } from '../stacks/default-stack';

/**
 * Deployable unit of web service app
 */
export class CdkpipelinesDemoStage extends Stage {
  public readonly urlOutput: CfnOutput;
  public readonly service: DefaultStack;
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    let buildConfig: BuildConfig = getConfig(this);

    let defaultStackName = buildConfig.App + "-" + buildConfig.Environment + "-default";
    const defaultStack = new DefaultStack(this, defaultStackName, {
      env: {
          region: buildConfig.AWSProfileRegion,
          account: buildConfig.AWSAccountID
      },
    }, buildConfig);
    
    Aspects.of(defaultStack).add(new AwsSolutionsChecks({ verbose: true }));
  }
}