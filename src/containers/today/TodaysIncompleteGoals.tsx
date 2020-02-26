import React from 'react';
import { convertGoalsToGoalRowProps, getIncompleteGoals } from '../../store/goals/selectors';
import { StoreState } from '../../store/types';
import { connect } from 'react-redux';
import { GoalList, GoalListProps } from '../../components';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { handleCompleteOrTrackRequest } from '../../store/goals/thunks';
import { getCurrentDate } from '../../store/settings/selectors';

interface TodaysIncompleteGoalsProps {
  onEditActionInteraction?: (goalId: string) => void;
  onInfoActionInteraction?: (goalId: string) => void;
  onChangeScrollEnabled?: (scrollEnabled: boolean) => void;
}

const mapStateToProps = (state: StoreState): GoalListProps => {
  const currentDate = getCurrentDate(state);

  return {
    goals: convertGoalsToGoalRowProps(state, getIncompleteGoals(state, currentDate), currentDate),
    emptyText: 'All done for today!',
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: TodaysIncompleteGoalsProps) => ({
  onCompleteOrTrackActionInteraction: (goalId: string) => dispatch(handleCompleteOrTrackRequest(goalId)),
  onEditActionInteraction: ownProps.onEditActionInteraction,
  onInfoActionInteraction: ownProps.onInfoActionInteraction,
  onChangeScrollEnabled: ownProps.onChangeScrollEnabled,
});

export const TodaysIncompleteGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
