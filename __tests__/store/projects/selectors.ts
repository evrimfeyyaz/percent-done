import { createProject } from '../../../src/factories/createProject';
import { createStoreState } from '../../../src/factories';
import { getAllProjects, getProjectByTitle } from '../../../src/store/projects/selectors';
import { Project } from '../../../src/store/projects/types';
import { StoreState } from '../../../src/store/types';

describe('projects selectors', () => {
  describe('getAllProjects', () => {
    it('returns all projects', () => {
      const project1 = createProject('Project 1');
      const project2 = createProject('Project 2');
      const state = createStoreState({ projects: [project1, project2] });

      const result = getAllProjects(state);

      expect(result).toEqual([project1, project2]);
    });
  });

  describe('getProjectByTitle', () => {
    let project1: Project, project2: Project, state: StoreState;

    beforeEach(() => {
      project1 = createProject('Project 1');
      project2 = createProject('Project 2');
      state = createStoreState({ projects: [project1, project2] });
    });

    it('returns the object with given title', () => {
      const result = getProjectByTitle(state, project1.title);

      expect(result).toEqual(project1);
    });

    it('returns `null` if no project exists with given title', () => {
      const result = getProjectByTitle(state, 'Non-existing Title');

      expect(result).toEqual(null);
    });
  });
});
