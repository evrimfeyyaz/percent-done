import React from 'react';
import { StoreState } from '../../store/types';
import { AnyAction } from 'redux';
import { getGoalById, getRemainingMs } from '../../store/goals/selectors';
import { updateTrackedGoalProjectId } from '../../store/goals/actions';
import { stopGoalTracking, updateTrackedGoalStartTimestamp } from '../../store/goals/thunks';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { TimeTracker, TimeTrackerProps } from '../../components';
import { getAllProjects } from '../../store/projects/selectors';
import { createProjectAndSetTrackedGoalProject } from '../../store/projects/thunks';
import { getGoalColor } from '../../store/goals/utilities';
import { momentWithDeviceLocale, NavigationService } from '../../utilities';

interface GoalTrackerProps {
  onDateChange?: () => void;
}

const mapStateToProps = (state: StoreState): TimeTrackerProps | undefined => {
  const { id: trackedGoalId, startTimestamp, projectId } = state.goals.trackedGoal;

  if (trackedGoalId == null || startTimestamp == null) return;

  const { areBreakNotificationsOn, notifyBreakAfterInMs } = state.settings;

  const goal = getGoalById(state, trackedGoalId);
  const { id: goalId, title, durationInMs, lastProjectId } = goal;

  const now = new Date();
  const initialRemainingMs = getRemainingMs(state, goal, now);

  const projects = getAllProjects(state).map(project => ({ key: project.id, title: project.title }));

  let projectKey = projectId;
  if (projectId == null && lastProjectId != null) {
    projectKey = lastProjectId;
  }

  // Here we set the starting time stamp to the beginning of the day
  // if the date of the start timestamp is not the same as the current
  // date. This situation can occur if a time tracking is started, the
  // app is closed, and then re-opened on another date.
  let trackerStartTimestamp = startTimestamp;
  if (!momentWithDeviceLocale(startTimestamp).isSame(now, 'day')) {
    trackerStartTimestamp = +momentWithDeviceLocale(now).startOf('day');
  }

  return {
    goalId,
    title,
    color: getGoalColor(goal),
    durationInMs: durationInMs ?? 0,
    initialRemainingMs: initialRemainingMs ?? 0,
    startTimestamp: trackerStartTimestamp,
    projects,
    projectKey,
    areBreakNotificationsOn,
    notifyBreakAfterInMs,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: GoalTrackerProps) => ({
  onStartTimestampChange: (newTimestamp: number) => dispatch(updateTrackedGoalStartTimestamp(newTimestamp)),
  onStopPress: (startTimestamp: number, endTimestamp: number) => NavigationService.goBack(),
  onProjectCreatePress: (title: string, goalId: string) => dispatch(createProjectAndSetTrackedGoalProject(title, goalId)),
  onProjectChange: (projectId: string, goalId: string) => dispatch(updateTrackedGoalProjectId(projectId, goalId)),
  onProjectRemove: (goalId: string) => dispatch(updateTrackedGoalProjectId(undefined, goalId)),
  onDidUnmount: () => dispatch(stopGoalTracking()),
});

export const GoalTracker = connect(mapStateToProps, mapDispatchToProps)(TimeTracker);
