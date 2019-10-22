import React from 'react';
import { convertGoalsToGoalListProps, getIncompleteGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList, GoalListProps } from '../components';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { handleGoalSwipe } from '../store/goals/thunks';

const today = getBeginningOfDay(new Date());

interface TodaysIncompleteGoalsProps {
  onRightActionPress?: (goalId: string) => void;
}

const mapStateToProps = (state: StoreState): GoalListProps => ({
  goals: convertGoalsToGoalListProps(state, getIncompleteGoals(state, today), today).goals,
  emptyText: 'All done for today!',
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: TodaysIncompleteGoalsProps) => ({
  onGoalRightSwipe: (goalId: string) => dispatch(handleGoalSwipe(goalId)),
  onRightActionPress: ownProps.onRightActionPress,
});

export const TodaysIncompleteGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
