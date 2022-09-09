// import * as child_process from 'child_process';
import { readFileSync } from 'fs';
import * as path from 'path';
import { SampleDir } from 'projen';
import { ApprovalLevel, AwsCdkTypeScriptApp, AwsCdkTypeScriptAppOptions } from 'projen/lib/awscdk';
import { CdkPipelineAspect } from './aspects/cdk-pipelines';

export interface ProjCdkAppOptions extends AwsCdkTypeScriptAppOptions {
  /**
   * Enable CDK pipelines
   *
   * @default false
   */
  readonly cdkPipelines?: boolean;
}

/**
 * Create a Proj CDK Typescript project.
 *
 * @pjid projcdk-app-ts
 */
export class ProjCDKTypescriptProject extends AwsCdkTypeScriptApp {
  constructor(options: ProjCdkAppOptions) {
    super({
      readme: {
        filename: 'README.md',
        contents: readme(),
      },

      github: false,
      sampleCode: false,
      cdkVersionPinning: true,
      requireApproval: ApprovalLevel.NEVER,
      mergify: false,
      ...options,
    });

    if (options.cdkPipelines) {
      new CdkPipelineAspect(this);
    }

    // Remove existing tasks
    this.removeTask('test-update');
    this.removeTask('upgrade');

    this.addDeps('cdk-nag@2.18.2', 'cdk-monitoring-constructs@1.22.3', '@randyridgley/cdk-constructs', 'js-yaml@4.1.0');

    this.addDevDeps('@types/js-yaml');

    new SampleDir(this, 'src', {
      sourceDir: path.join(__dirname, '..', 'sample/src'),
    });

    if (options.cdkPipelines) {
      new SampleDir(this, 'src/pipeline', {
        sourceDir: path.join(__dirname, '..', 'sample/pipeline'),
      });

      new SampleDir(this, 'environments', {
        sourceDir: path.join(__dirname, '..', 'sample/environments/pipeline'),
      });
    } else {
      new SampleDir(this, 'environments', {
        sourceDir: path.join(__dirname, '..', 'sample/environments/standard'),
      });
    }
  }

  postSynthesize(): void {
    // const out = child_process.execSync(this.runTaskCommand(this.lintFix));
    // console.log(out.toString('utf-8'));

    console.log('Synth complete! See README.md for usage.');
  }
}

const readme = (): string => {
  return readFileSync(path.join(__dirname, '..', 'sample/README.md')).toString('utf-8');
};
