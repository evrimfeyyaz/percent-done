import { createGoal, createStoreState, createTimetableEntry } from '../../../src/factories';
import thunk, { ThunkDispatch } from 'redux-thunk';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { StoreState } from '../../../src/store/types';
import { AnyAction } from 'redux';
import { ADD_PROJECT, DELETE_PROJECT, Project } from '../../../src/store/projects/types';
import {
  createProjectAndReturnId,
  createProjectAndSetTrackedGoalProject,
  deleteProject,
} from '../../../src/store/projects/thunks';
import { createProject } from '../../../src/factories/createProject';
import { EDIT_GOAL, UPDATE_TRACKED_GOAL_PROJECT_ID } from '../../../src/store/goals/types';
import { EDIT_TIMETABLE_ENTRY } from '../../../src/store/timetableEntries/types';

const middlewares = [thunk];
const mockStore = configureStore<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>(middlewares);

describe('projects thunks', () => {
  let title: string;
  let project: Project;
  let state: StoreState;
  let store: MockStoreEnhanced<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>;

  beforeAll(() => {
    title = 'Project Title';
    project = createProject(title);
    state = createStoreState({ projects: [project] });
    store = mockStore(state);
  });

  beforeEach(() => {
    store.clearActions();
  });

  describe('createProjectAndReturnId', () => {
    it('creates a project and returns its id', () => {
      const id = store.dispatch(createProjectAndReturnId(title));
      const actionTypes = store.getActions().map(action => action.type);

      expect(actionTypes).toContain(ADD_PROJECT);
      expect(id).toEqual(project.id);
    });
  });

  describe('createProjectAndSetTrackedGoalProject', () => {
    it('creates a project and sets it as the tracked goal project', () => {
      store.dispatch(createProjectAndSetTrackedGoalProject(title));
      const actionTypes = store.getActions().map(action => action.type);

      expect(actionTypes).toEqual([ADD_PROJECT, UPDATE_TRACKED_GOAL_PROJECT_ID]);
    });
  });

  describe('deleteProject', () => {
    it('deletes the project and all its references in goals and timetable entries', () => {
      const goal = createGoal({ lastProjectId: project.id });
      const timetableEntry = createTimetableEntry({
        projectId: project.id,
        startDate: new Date(),
        startHour: 10,
        durationInMin: 30,
      });

      state = createStoreState({ projects: [project], goals: [goal], timetableEntries: [timetableEntry] });
      store = mockStore(state);

      store.dispatch(deleteProject(project));
      const actions = store.getActions();
      const actionTypes = actions.map(action => action.type);

      expect(actionTypes).toEqual([EDIT_GOAL, EDIT_TIMETABLE_ENTRY, DELETE_PROJECT]);
    });
  });
});
