
import { CfnOutput, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DefaultStack } from '../stacks/default-stack';

/**
 * Deployable unit of web service app
 */
export class CdkpipelinesDemoStage extends Stage {
  public readonly urlOutput: CfnOutput;
  public readonly service: DefaultStack;
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    this.service = new DefaultStack(this, 'DefaultStack');
    
    // Expose CdkpipelinesDemoStack's output one level higher
    this.urlOutput = this.service.urlOutput;
  }
}