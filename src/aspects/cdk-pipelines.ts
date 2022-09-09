import * as pj from 'projen';
import { ProjCDKTypescriptProject } from '..';

export class CdkPipelineAspect extends pj.Component {
  constructor(app: ProjCDKTypescriptProject) {
    super(app);

    if (app.cdkVersion.startsWith('1.')) {
      app.addCdkDependency(
        '@aws-cdk/aws-codebuild',
        '@aws-cdk/aws-codepipeline',
        '@aws-cdk/aws-codepipeline-actions',
        '@aws-cdk/pipelines',
      );
    }
  }
}
