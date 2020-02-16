import React from 'react';
import { convertGoalsToGoalRowProps, getCompleteGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { connect } from 'react-redux';
import { GoalList, GoalListProps } from '../components';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { handleCompleteOrTrackRequest } from '../store/goals/thunks';
import { getCurrentDate } from '../store/settings/selectors';

interface TodaysCompletedGoalsProps {
  onEditActionInteraction?: (goalId: string) => void;
  onChangeScrollEnabled?: (scrollEnabled: boolean) => void;
  onInfoActionInteraction?: (goalId: string) => void;
}

const mapStateToProps = (state: StoreState): GoalListProps => {
  const currentDate = getCurrentDate(state);

  return {
    goals: convertGoalsToGoalRowProps(state, getCompleteGoals(state, currentDate), currentDate),
    emptyText: 'Nothing completed yet,\nbetter get started.',
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: TodaysCompletedGoalsProps) => ({
  onCompleteOrTrackActionInteraction: (goalId: string) => dispatch(handleCompleteOrTrackRequest(goalId)),
  onEditActionInteraction: ownProps.onEditActionInteraction,
  onInfoActionInteraction: ownProps.onInfoActionInteraction,
  onChangeScrollEnabled: ownProps.onChangeScrollEnabled,
});

export const TodaysCompletedGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
