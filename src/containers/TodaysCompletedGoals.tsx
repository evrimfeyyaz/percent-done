import React from 'react';
import { convertGoalsToGoalListProps, getCompleteGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList, GoalListProps } from '../components';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { handleGoalSwipe } from '../store/goals/thunks';

const today = getBeginningOfDay(new Date());

interface TodaysCompletedGoalsProps {
  onRightActionPress?: (goalId: string) => void;
}

const mapStateToProps = (state: StoreState): GoalListProps => ({
  goals: convertGoalsToGoalListProps(state, getCompleteGoals(state, today), today).goals,
  emptyText: 'Nothing completed yet,\nbetter get started.',
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: TodaysCompletedGoalsProps) => ({
  onGoalRightSwipe: (goalId: string) => dispatch(handleGoalSwipe(goalId)),
  onRightActionPress: ownProps.onRightActionPress,
});

export const TodaysCompletedGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
