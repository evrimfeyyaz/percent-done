import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../types';
import { GoalActionTypes } from '../goals/types';
import { updateTrackedGoalProjectId } from '../goals/actions';
import { ProjectActionTypes } from './types';
import { addProject } from './actions';
import { getProjectByTitle } from './selectors';

export const createProjectAndReturnId: ActionCreator<ThunkAction<void, StoreState, void, ProjectActionTypes | GoalActionTypes>> = (title: string) => {
  return (dispatch, getState) => {
    dispatch(addProject(title));

    const state = getState();
    const project = getProjectByTitle(state, title);

    if (project == null) {
      throw Error('Project does not exist.');
    }

    return project.id;
  };
};

export const createProjectAndSetTrackedGoalProject: ActionCreator<ThunkAction<void, StoreState, void, ProjectActionTypes | GoalActionTypes>> = (title: string) => {
  return (dispatch) => {
    const id = dispatch(createProjectAndReturnId(title)) as unknown as string;

    dispatch(updateTrackedGoalProjectId(id));
  };
};
