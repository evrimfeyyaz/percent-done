import React from 'react';
import { StoreState } from '../store/types';
import { AnyAction } from 'redux';
import { getGoalById, getRemainingMs } from '../store/goals/selectors';
import { updateTrackedGoalProjectId, updateTrackedGoalStartTimestamp } from '../store/goals/actions';
import { stopGoalTracking } from '../store/goals/thunks';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { TimeTracker, TimeTrackerProps } from '../components';
import { getAllProjects } from '../store/projects/selectors';
import { createProjectAndSetTrackedGoalProject } from '../store/projects/thunks';
import { getGoalColor } from '../store/goals/utilities';
import { NavigationService } from '../utilities';

const mapStateToProps = (state: StoreState): TimeTrackerProps | undefined => {
  const { id: trackedGoalId, startTimestamp, projectId } = state.goals.trackedGoal;

  if (trackedGoalId == null || startTimestamp == null) return;

  const goal = getGoalById(state, trackedGoalId);
  const { title, durationInMs, lastProjectId } = goal;

  if (durationInMs == null) throw new Error('Goal is not a time-tracked goal.');
  const initialRemainingMs = getRemainingMs(state, goal, new Date());

  const projects = getAllProjects(state).map(project => ({ key: project.id, title: project.title }));

  let projectKey = projectId;
  if (projectId == null && lastProjectId != null) {
    projectKey = lastProjectId;
  }

  return {
    title,
    color: getGoalColor(goal),
    durationInMs,
    initialRemainingMs,
    startTimestamp,
    projects,
    projectKey,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>) => ({
  onStartTimestampChange: (newTimestamp: number) => dispatch(updateTrackedGoalStartTimestamp(newTimestamp)),
  onStopPress: (startTimestamp: number, endTimestamp: number) => NavigationService.goBack(),
  onProjectCreatePress: (title: string) => dispatch(createProjectAndSetTrackedGoalProject(title)),
  onProjectChange: (id: string) => dispatch(updateTrackedGoalProjectId(id)),
  onProjectRemove: () => dispatch(updateTrackedGoalProjectId(undefined)),
  onDidUnmount: () => dispatch(stopGoalTracking()),
});

export const GoalTracker = connect(mapStateToProps, mapDispatchToProps)(TimeTracker);
