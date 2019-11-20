import React from 'react';
import { StoreState } from '../store/types';
import { AnyAction } from 'redux';
import { getGoalById, getRemainingMs } from '../store/goals/selectors';
import { updateTrackedGoalStartTimestamp } from '../store/goals/actions';
import { stopGoalTracking } from '../store/goals/thunks';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { TimeTracker, TimeTrackerProps } from '../components';

const mapStateToProps = (state: StoreState): TimeTrackerProps | undefined => {
  const { id: trackedGoalId, startTimestamp } = state.goals.trackedGoal;

  if (trackedGoalId == null || startTimestamp == null) return;

  const goal = getGoalById(state, trackedGoalId);
  const { title, color, durationInMs } = goal;

  if (durationInMs == null) throw new Error('Goal is not a time-tracked goal.');
  const initialRemainingMs = getRemainingMs(state, goal, new Date());

  return {
    title,
    color,
    durationInMs,
    initialRemainingMs,
    startTimestamp,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>) => ({
  onStartTimestampChange: (newTimestamp: number) => dispatch(updateTrackedGoalStartTimestamp(newTimestamp)),
  onStopPress: (startTimestamp: number, endTimestamp: number) => dispatch(stopGoalTracking(endTimestamp)),
});

export const GoalTracker = connect(mapStateToProps, mapDispatchToProps)(TimeTracker);
