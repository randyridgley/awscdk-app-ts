import { Testing } from 'projen';
import { ProjCDKTypescriptProject } from '../src';

test('should match synth snapshot', () => {
  const prj = new ProjCDKTypescriptProject({ name: 'test' });
  expect(Testing.synth(prj)).toMatchSnapshot();
});
