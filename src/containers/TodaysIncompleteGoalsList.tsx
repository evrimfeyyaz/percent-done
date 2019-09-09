import React from 'react';
import { convertGoalsToGoalListProps, getIncompleteGoals } from '../store/goals/selectors';
import { StoreState } from '../store/types';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { GoalList } from '../components';

const today = getBeginningOfDay(new Date());

const mapStateToProps = (state: StoreState) => ({
  goals: convertGoalsToGoalListProps(state, getIncompleteGoals(state, today), today).goals,
});

export const TodaysIncompleteGoalsList = connect(mapStateToProps, null)(GoalList);
