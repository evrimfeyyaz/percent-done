import React from 'react';
import { Dispatch } from 'redux';
import { addGoal } from '../../store/goals/actions';
import { Goal, GoalActionTypes } from '../../store/goals/types';
import { connect } from 'react-redux';
import { GoalForm, GoalFormProps } from '../../components';
import { StoreState } from '../../store/types';
import { getAllGoals } from '../../store/goals/selectors';
import { WithOptionalId } from '../../utilities/types';

const mapStateToProps = (state: StoreState) => ({
  allGoalTitles: getAllGoals(state).map(goal => goal.title),
});

const mapDispatchToProps = (dispatch: Dispatch<GoalActionTypes>): Partial<GoalFormProps> => ({
  onSubmit: (goal: WithOptionalId<Goal>) => dispatch(addGoal(goal)),
});

export const AddGoalForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(GoalForm);
