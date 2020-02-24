import { projectsReducer } from '../../../src/store/projects/reducers';
import { addProject, editProject } from '../../../src/store/projects/actions';
import { DeleteProjectAction, Project, ProjectsState } from '../../../src/store/projects/types';

describe('projects reducer', () => {
  const initialState: ProjectsState = {
    byId: {},
    idByTitle: {},
    allIds: [],
  };

  const existingProject: Project = {
    id: 'SOME_PROJECT_ID',
    title: 'Some Project',
  };
  const stateWithProject: ProjectsState = {
    byId: {
      [existingProject.id]: existingProject,
    },
    idByTitle: {
      [existingProject.title.toLowerCase()]: existingProject.id,
    },
    allIds: [existingProject.id],
  };

  it('returns the initial state', () => {
    // @ts-ignore
    expect(projectsReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('handles adding a project', () => {
    const title = 'Project Title';
    const action = addProject(title);

    const result = projectsReducer(initialState, action);

    expect(result.allIds[0]).toBeDefined();
    const id = result.allIds[0];

    expect(result.idByTitle[title.toLowerCase()]).toEqual(id);
    expect(result.byId[id]).toEqual({
      id,
      title,
    });
  });

  it('handles editing a project', () => {
    const title = 'Edited Project Title';
    const editedProject = {
      ...existingProject,
      title,
    };
    const action = editProject(editedProject, existingProject);

    const result = projectsReducer(stateWithProject, action);

    expect(result.byId[existingProject.id]).toEqual(editedProject);
    expect(result.allIds).toEqual([existingProject.id]);
    expect(result.idByTitle[editedProject.title.toLowerCase()]).toEqual(existingProject.id);
    expect(result.idByTitle[existingProject.title.toLowerCase()]).toBeUndefined();
  });

  it('handles deleting a project', () => {
    const action: DeleteProjectAction = {
      type: 'DELETE_PROJECT',
      project: existingProject,
    };

    const result = projectsReducer(stateWithProject, action);

    expect(result).toEqual(initialState);
  });
});
