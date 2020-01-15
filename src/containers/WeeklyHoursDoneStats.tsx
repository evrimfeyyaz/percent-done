import React from 'react';
import { StoreState } from '../store/types';
import { HoursDoneStats, PercentDoneStatsProps } from '../components';
import { getTotalCompletedMsForLast7Days } from '../store/goals/selectors';
import { connect } from 'react-redux';

const mapStateToProps = (state: StoreState): PercentDoneStatsProps => ({
  data: getTotalCompletedMsForLast7Days(state),
});

export const WeeklyHoursDoneStats = connect(mapStateToProps)(HoursDoneStats);
