import React from 'react';
import { convertGoalsToGoalListProps, getAllGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList, GoalListProps } from '../components';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { handleCompleteOrTrackRequest } from '../store/goals/thunks';

const today = getBeginningOfDay(new Date());

interface AllGoalsProps {
  onRightActionPress?: (goalId: string) => void;
}

const mapStateToProps = (state: StoreState): GoalListProps => ({
  goals: convertGoalsToGoalListProps(state, getAllGoals(state), today).goals,
  emptyText: 'You haven\'t added any goals yet.',
  disableRightSwipe: true,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: AllGoalsProps) => ({
  onGoalRightSwipe: (goalId: string) => dispatch(handleCompleteOrTrackRequest(goalId)),
  onRightActionPress: ownProps.onRightActionPress,
});

export const AllGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
