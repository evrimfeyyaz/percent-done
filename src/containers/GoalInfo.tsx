import React from 'react';
import { StoreState } from '../store/types';
import { GoalDetails, GoalDetailsProps } from '../components';
import {
  getChainLength,
  getCompletedMs,
  getGoalById,
  getTotalCompletedMsForGoal,
  isCompleted,
} from '../store/goals/selectors';
import { isTimeTracked } from '../store/goals/utilities';
import { Dispatch } from 'redux';
import { GoalActionTypes } from '../store/goals/types';
import { handleCompleteOrTrackRequest } from '../store/goals/thunks';
import { NavigationService } from '../utilities';
import { connect } from 'react-redux';

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

const mapDispatchToProps = (dispatch: Dispatch<GoalActionTypes>, ownProps: GoalInfoProps): Partial<GoalDetailsProps> => ({
  onTrackOrCompleteButtonPress: () => handleCompleteOrTrackRequest(ownProps.goalId),
  onEditButtonPress: () => NavigationService.navigate('EditGoal', { goalId: ownProps.goalId }),
});

export const GoalInfo = connect(mapStateToProps, mapDispatchToProps)(GoalDetails);
