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

      deps: ['cdk-nag@2.18.2', 'cdk-monitoring-constructs@1.22.3', '@randyridgley/cdk-constructs'],

      devDeps: [
        '@types/jest@^27.5.0',
        '@types/node@17.0.35',
        'eslint@^8.16.0',
        'jest@^27.5.1',
        'prettier@^2.7.1',
        'ts-jest@^27.1.4',
        'ts-node@^10.8.0',
        'typescript@~4.7.2',
        'eslint-config-prettier@^8.5.0',

        'aws-cdk-lib@2.40.0',
        'cdk-nag@2.18.2',
        'constructs@10.1.94',
        'cdk-monitoring-constructs@1.22.3',
        'js-yaml@4.1.0',
        '@randyridgley/cdk-constructs',

        // '@randyridgley/awscdk-app-ts', // required for subsequent synths ('npx projen') to work!
      ],
      github: false,
      sampleCode: false,
      cdkVersionPinning: true,
      requireApproval: ApprovalLevel.NEVER,
      mergify: false,
      tsconfig: {
        compilerOptions: {
          esModuleInterop: true,
        },
      },
      ...options,
    });

    if (options.cdkPipelines) {
      new CdkPipelineAspect(this);
    }

    // Remove existing tasks
    this.removeTask('test-update');
    this.removeTask('upgrade');

    new SampleDir(this, 'src', {
      sourceDir: path.join(__dirname, '..', 'sample/src'),
    });

    new SampleDir(this, 'environments', {
      sourceDir: path.join(__dirname, '..', 'sample/environments'),
    });
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
