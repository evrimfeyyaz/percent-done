import React from 'react';
import { convertGoalsToGoalRowProps, getIncompleteGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList, GoalListProps } from '../components';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { handleCompleteOrTrackRequest } from '../store/goals/thunks';

const today = getBeginningOfDay(new Date());

interface TodaysIncompleteGoalsProps {
  onEditActionInteraction?: (goalId: string) => void;
  onChangeScrollEnabled?: (scrollEnabled: boolean) => void;
}

const mapStateToProps = (state: StoreState): GoalListProps => ({
  goals: convertGoalsToGoalRowProps(state, getIncompleteGoals(state, today), today),
  emptyText: 'All done for today!',
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: TodaysIncompleteGoalsProps) => ({
  onCompleteOrTrackActionInteraction: (goalId: string) => dispatch(handleCompleteOrTrackRequest(goalId)),
  onEditActionInteraction: ownProps.onEditActionInteraction,
  onChangeScrollEnabled: ownProps.onChangeScrollEnabled,
});

export const TodaysIncompleteGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
