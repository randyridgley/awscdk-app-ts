import { StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BuildConfig } from '../environment/build-config';
import { BaseStack } from './base-stack';

export interface PipelineStackProps extends StackProps {
  
}

export class PipelineStack extends BaseStack {
  private readonly buildConfig: BuildConfig;

  constructor(scope: Construct, id: string, props: PipelineStackProps, buildConfig: BuildConfig) {
    super(scope, id, props, buildConfig);
    this.buildConfig = buildConfig;
  }
}
