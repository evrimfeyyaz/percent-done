import React from 'react';
import { convertGoalsToGoalRowProps, getAllGoals } from '../../store/goals/selectors';
import { StoreState } from '../../store/types';
import { connect } from 'react-redux';
import { GoalList, GoalListProps } from '../../components';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getCurrentDate } from '../../store/settings/selectors';

interface AllGoalsProps {
  onEditActionInteraction?: (goalId: string) => void;
  onInfoActionInteraction?: (goalId: string) => void;
}

const mapStateToProps = (state: StoreState): GoalListProps => {
  const currentDate = getCurrentDate(state);

  return {
    goals: convertGoalsToGoalRowProps(state, getAllGoals(state), currentDate),
    disableLeftActions: true,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: AllGoalsProps) => ({
  onEditActionInteraction: ownProps.onEditActionInteraction,
  onInfoActionInteraction: ownProps.onInfoActionInteraction,
});

export const AllGoals = connect(mapStateToProps, mapDispatchToProps)(GoalList);
