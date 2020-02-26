import React from 'react';
import { StoreState } from '../../store/types';
import {
  getTotalRemainingMsForDate,
  getTotalCompletedMsForDate,
  getTotalProgressForDate,
} from '../../store/goals/selectors';
import { connect } from 'react-redux';
import { DaysStats, DaysStatsProps } from '../../components';
import { getCurrentDate } from '../../store/settings/selectors';

const mapStateToProps = (state: StoreState): DaysStatsProps => {
  const currentDate = getCurrentDate(state);

  return {
    percentDone: getTotalProgressForDate(state, currentDate) ?? 100,
    completedMs: getTotalCompletedMsForDate(state, currentDate) ?? 0,
    remainingMs: getTotalRemainingMsForDate(state, currentDate),
  };
};

export const TodaysStats = connect(mapStateToProps, null)(DaysStats) as any;
