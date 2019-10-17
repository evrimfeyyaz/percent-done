import React from 'react';
import { StoreState } from '../store/types';
import {
  getTotalRemainingMsForDate,
  getTotalCompletedMsForDate,
  getTotalProgressForDate,
} from '../store/goals/selectors';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { DaysStats } from '../components';

const today = getBeginningOfDay(new Date());

const mapStateToProps = (state: StoreState) => ({
  percentDone: getTotalProgressForDate(state, today),
  completedMs: getTotalCompletedMsForDate(state, today),
  remainingMs: getTotalRemainingMsForDate(state, today),
});

export const TodaysStats = connect(mapStateToProps, null)(DaysStats) as any;
