import React from 'react';
import { convertGoalsToGoalListProps, getCompleteGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList } from '../components';

const today = getBeginningOfDay(new Date());

const mapStateToProps = (state: StoreState) => ({
  goals: convertGoalsToGoalListProps(state, getCompleteGoals(state, today), today).goals,
});

export const TodaysCompletedGoals = connect(mapStateToProps, null)(GoalList);
