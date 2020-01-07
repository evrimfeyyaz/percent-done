import React from 'react';
import { Dispatch } from 'redux';
import { deleteGoal, editGoal } from '../store/goals/actions';
import { Goal, GoalActionTypes } from '../store/goals/types';
import { connect } from 'react-redux';
import { GoalForm, GoalFormProps } from '../components';
import { StoreState } from '../store/types';
import { getAllGoals, getGoalById } from '../store/goals/selectors';

interface EditGoalFormProps {
  goalId: string;
  onDelete?: () => void;
}

const mapStateToProps = (state: StoreState, ownProps: EditGoalFormProps): GoalFormProps => ({
  goal: getGoalById(state, ownProps.goalId),
  allGoalTitles: getAllGoals(state).map(goal => goal.title),
});

const mapDispatchToProps = (dispatch: Dispatch<GoalActionTypes>, ownProps: EditGoalFormProps) => ({
  onSubmit: (goal: Goal) => dispatch(editGoal(goal)),
  onDelete: (goalId: string) => {
    ownProps.onDelete?.();
    dispatch(deleteGoal(goalId));
  },
});

export const EditGoalForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(GoalForm);
