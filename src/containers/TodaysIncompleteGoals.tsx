import React from 'react';
import { convertGoalsToGoalListProps, getIncompleteGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList } from '../components';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { handleGoalSwipe } from '../store/goals/thunks';

const today = getBeginningOfDay(new Date());

const mapStateToProps = (state: StoreState) => ({
  goals: convertGoalsToGoalListProps(state, getIncompleteGoals(state, today), today).goals,
  emptyText: 'All done for today!',
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>) => ({
  onGoalRightSwipe: (goalId: string) => dispatch(handleGoalSwipe(goalId)),
});

export const TodaysIncompleteGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
