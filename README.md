# @randyridgley/awscdk-app-ts

**WARNING: this repository is currently experimental.**

A [projen](https://github.com/projen/projen) project generator for cdk apps.

Packages are stored on Github Packages so you will need to modify your `.npmrc` file to access and authenticate to the Github packages repo. The `PERSONAL_ACCESS_TOKEN` will need `repo*`, `read` and `write` `packages`. To authenticate to Github use your favorite editor to add the below to `~/.npmrc`:

```bash
@randyridgley:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken={PERSONAL_ACCESS_TOKEN}
```

To create a new project run the following from within a `cdk` directory in your
repository:

``` bash
npx projen new --from @randyridgley/awscdk-app-ts
```

Unlike most starter-kits, projen is not a one-off generator, and synthesized
files should not be manually edited. The only files you should edit are:

* `src/` - your Typescript CDK files and tests
* `environments/` - your Yaml files for environment settings
* `.projenrc.js` - to update settings, e.g. to add extra dev dependencies (run
  `npx projen` to re-synth after any changes)

Tasks, such as `test`, `lint`, etc., can be run using:

```bash
npx projen [task]
```

To list all possible tasks and their descriptions run:

```bash
npx projen --help
```

