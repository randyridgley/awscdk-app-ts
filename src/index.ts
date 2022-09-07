// import * as child_process from 'child_process';
import { readFileSync } from 'fs';
import * as path from 'path';
import { JsonFile, SampleDir } from 'projen';
import { TypeScriptAppProject, TypeScriptProjectOptions } from 'projen/lib/typescript';

export interface ProjCDKTypescriptOptions {

  /**
   * Package name
   */
  readonly name: string;

  /**
   * Target for synth.
   */
  readonly outdir?: string;
}

/**
 * Create a Proj CDK Typescript project.
 *
 * @pjid projcdk-app-ts
 */
export class ProjCDKTypescriptProject extends TypeScriptAppProject {
  constructor(options: ProjCDKTypescriptOptions) {

    const defaults: ProjCDKTypescriptOptions = {
      name: 'TODO',
    };

    const tsOpts: TypeScriptProjectOptions = {
      defaultReleaseBranch: 'main',
      readme: {
        filename: 'README.md',
        contents: readme(),
      },

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

        '@randyridgley/awscdk-app-ts', // required for subsequent synths ('npx projen') to work!
      ],

      github: false,
      sampleCode: false,
      jest: false,
      prettier: false,
      eslint: false,

      ...defaults,
      ...options,
    };

    super(tsOpts);

    // Remove existing tasks
    this.removeTask('build');
    this.removeTask('clobber');
    this.removeTask('compile');
    this.removeTask('eslint');
    this.removeTask('package');
    this.removeTask('post-compile');
    this.removeTask('post-upgrade');
    this.removeTask('pre-compile');
    this.removeTask('projen');
    this.removeTask('test');
    this.removeTask('test-update');
    this.removeTask('upgrade');
    // this.removeTask('watch');

    // Define our own tasks
    this.addTask('dependencies', { exec: this.package.installCommand, description: 'Install dependencies based on lockfile e.g. during CI' });
    this.addTask('test', { exec: 'jest', description: 'Run tests' });
    this.addTask('lint', { exec: 'eslint --ext .ts --no-error-on-unmatched-pattern lib/**', description: 'Lint sources using eslint' });
    this.addTask('synth', { exec: 'cdk synth --path-metadata false --version-reporting false', description: 'synth CDK stack(s)' });
    this.addTask('diff', { exec: 'cdk diff --path-metadata false --version-reporting false', description: 'diff CDK stack' });

    this.addFields({
      jest: {
        testMatch: ['<rootDir>/lib/**/*.test.ts'],
        transform: {
          '^.+\\.tsx?$': 'ts-jest',
        },
        setupFilesAfterEnv: ['./jest.setup.js'],
      },

      eslintConfig: {
        root: true,
        env: {
          node: true,
          jest: true,
        },
        extends: ['eslint-config-typescript', 'prettier'],
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
        },
        plugins: ['@typescript-eslint'],
        rules: {
          '@typescript-eslint/no-inferrable-types': 0,
          'import/no-namespace': 2,
        },
        ignorePatterns: ['**/*.js', '**/*.d.ts', 'node_modules', 'cdk.out'],
      },

    });

    new JsonFile(this, 'cdk.json', {
      obj: {
        app: 'npx ts-node src/main.ts',
      },
    });

    new SampleDir(this, 'src', {
      sourceDir: path.join(__dirname, '..', 'sample'),
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