import React from 'react';
import { Dispatch } from 'redux';
import { editGoal } from '../store/goals/actions';
import { Goal, GoalActionTypes } from '../store/goals/types';
import { connect } from 'react-redux';
import { GoalForm, GoalFormProps } from '../components';
import { StoreState } from '../store/types';
import { getGoalById } from '../store/goals/selectors';

interface EditGoalFormProps {
  goalId: string;
}

const mapStateToProps = (state: StoreState, ownProps: EditGoalFormProps): GoalFormProps => ({
  goal: getGoalById(state, ownProps.goalId),
});

const mapDispatchToProps = (dispatch: Dispatch<GoalActionTypes>) => ({
  onSubmit: (goal: Goal) => dispatch(editGoal(goal)),
});

export const EditGoalForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(GoalForm);
