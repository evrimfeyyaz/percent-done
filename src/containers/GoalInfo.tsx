import React from 'react';
import { StoreState } from '../store/types';
import { GoalDetails, GoalDetailsProps } from '../components';
import {
  getChainLength,
  getGoalById,
  getTotalCompletedMsForGoal,
  isCompleted,
} from '../store/goals/selectors';
import { isTimeTracked } from '../store/goals/utilities';
import { AnyAction } from 'redux';
import { handleCompleteOrTrackRequest } from '../store/goals/thunks';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

interface GoalInfoProps {
  goalId: string;
  date: Date;
}

const mapStateToProps = (state: StoreState, ownProps: GoalInfoProps): GoalDetailsProps => {
  const { goalId, date } = ownProps;
  const goal = getGoalById(state, goalId);

  return {
    title: goal.title,
    isTracked: isTimeTracked(goal),
    chainLength: getChainLength(state, goal, date),
    isCompleted: isCompleted(state, goal, date),
    totalCompletedMs: getTotalCompletedMsForGoal(state, goal),
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: GoalInfoProps): Partial<GoalDetailsProps> => ({
  onTrackOrCompleteButtonPress: () => dispatch(handleCompleteOrTrackRequest(ownProps.goalId)),
});

export const GoalInfo = connect(mapStateToProps, mapDispatchToProps)(GoalDetails);
