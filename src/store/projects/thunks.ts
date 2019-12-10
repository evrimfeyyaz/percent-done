import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../types';
import { GoalActionTypes } from '../goals/types';
import { TimetableEntryActionTypes } from '../timetableEntries/types';
import { setTrackedGoal, updateTrackedGoalProjectId } from '../goals/actions';
import { NavigationService } from '../../utilities';
import { ProjectActionTypes } from './types';
import { addProject } from './actions';
import { getProjectByTitle } from './selectors';

export const createProjectAndSetTrackedGoalProject: ActionCreator<ThunkAction<void, StoreState, void, ProjectActionTypes | GoalActionTypes>> = (title: string) => {
  return (dispatch, getState) => {
    dispatch(addProject(title));

    const state = getState();
    const project = getProjectByTitle(state, title);

    if (project == null) {
      throw Error('Project does not exist.');
    }

    dispatch(updateTrackedGoalProjectId(project.id));
  };
};
