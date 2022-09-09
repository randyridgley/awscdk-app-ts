import { Testing } from 'projen';
import { ProjCDKTypescriptProject } from '../src';

test('should match synth snapshot', () => {
  const prj = new ProjCDKTypescriptProject({
    defaultReleaseBranch: 'main',
    name: 'test',
    cdkVersion: '2.1.0',
  });
  expect(Testing.synth(prj)).toMatchSnapshot();
});
