import React from 'react';
import { Dispatch } from 'redux';
import { addGoal } from '../store/goals/actions';
import { Goal, GoalActionTypes } from '../store/goals/types';
import { connect } from 'react-redux';
import { GoalForm, GoalFormProps } from '../components';

const mapDispatchToProps = (dispatch: Dispatch<GoalActionTypes>): GoalFormProps => ({
  onSubmit: (goal: Goal) => dispatch(addGoal(goal)),
});

export const AddGoalForm = connect(null, mapDispatchToProps, null, { forwardRef: true })(GoalForm);
