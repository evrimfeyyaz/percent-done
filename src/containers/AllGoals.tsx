import React from 'react';
import { convertGoalsToGoalListProps, getAllGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList } from '../components';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { handleGoalSwipe } from '../store/goals/thunks';

const today = getBeginningOfDay(new Date());

const mapStateToProps = (state: StoreState) => ({
  goals: convertGoalsToGoalListProps(state, getAllGoals(state), today).goals,
  emptyText: 'You haven\'t added any goals yet.',
  disableRightSwipe: true,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>) => ({
  onGoalRightSwipe: (goalId: string) => dispatch(handleGoalSwipe(goalId)),
});

export const AllGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
