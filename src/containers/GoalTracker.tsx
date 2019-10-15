import React from 'react';
import { StoreState } from '../store/types';
import { AnyAction } from 'redux';
import { getGoalById, getRemainingSecondsForDate } from '../store/goals/selectors';
import { updateTrackedGoalStartTimestamp } from '../store/goals/actions';
import { stopGoalTracking } from '../store/goals/thunks';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { TimeTracker } from '../components';

const mapStateToProps = (state: StoreState) => {
  const { id: trackedGoalId, startTimestamp } = state.goals.trackedGoal;

  if (trackedGoalId == null || startTimestamp == null) return;

  const { title, color, durationInSeconds } = getGoalById(state, trackedGoalId);
  const initialRemainingSeconds = getRemainingSecondsForDate(state, new Date());

  if (durationInSeconds == null) throw Error('Goal is not a time-tracked goal.');

  return {
    title,
    color,
    durationInSeconds,
    initialRemainingSeconds,
    startTimestamp,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>) => ({
  onStartTimestampChange: (newTimestamp: number) => dispatch(updateTrackedGoalStartTimestamp(newTimestamp)),
  onStopPress: (startTimestamp: number, endTimestamp: number) => dispatch(stopGoalTracking(endTimestamp)),
});

export const GoalTracker = connect(mapStateToProps, mapDispatchToProps)(TimeTracker);
