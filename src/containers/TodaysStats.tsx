import React from 'react';
import { StoreState } from '../store/types';
import {
  getRemainingSecondsForDate,
  getTotalCompletedSecondsForDate,
  getTotalProgressForDate,
} from '../store/goals/selectors';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { DaysStats } from '../components';

const today = getBeginningOfDay(new Date());

const mapStateToProps = (state: StoreState) => ({
  percentDone: getTotalProgressForDate(state, today),
  completedSeconds: getTotalCompletedSecondsForDate(state, today),
  remainingSeconds: getRemainingSecondsForDate(state, today),
});

export const TodaysStats = connect(mapStateToProps, null)(DaysStats);
