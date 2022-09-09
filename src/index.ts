// import * as child_process from 'child_process';
import { readFileSync } from 'fs';
import * as path from 'path';
import { SampleDir } from 'projen';
import { ApprovalLevel, AwsCdkTypeScriptApp, AwsCdkTypeScriptAppOptions } from 'projen/lib/awscdk';
export interface ProjCdkAppOptions extends AwsCdkTypeScriptAppOptions {}

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
      requireApproval: ApprovalLevel.NEVER,
      mergify: false,
      projenrcTs: true,
      ...options,
    });

    // Remove existing tasks
    this.removeTask('test-update');
    this.removeTask('upgrade');

    this.addDeps('cdk-nag@2.18.2', 'cdk-monitoring-constructs@1.22.3', '@randyridgley/cdk-constructs', 'js-yaml@4.1.0');

    this.addDevDeps(
      '@types/js-yaml',
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
      'constructs@10.1.94',
    );

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
