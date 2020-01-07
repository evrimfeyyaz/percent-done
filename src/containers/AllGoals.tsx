import React from 'react';
import { convertGoalsToGoalRowProps, getAllGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList, GoalListProps } from '../components';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const today = getBeginningOfDay(new Date());

interface AllGoalsProps {
  onEditActionInteraction?: (goalId: string) => void;
}

const mapStateToProps = (state: StoreState): GoalListProps => ({
  goals: convertGoalsToGoalRowProps(state, getAllGoals(state), today),
  emptyText: 'You haven\'t added any goals yet.',
  disableRightSwipe: true,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: AllGoalsProps) => ({
  onEditActionInteraction: ownProps.onEditActionInteraction,
});

export const AllGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
