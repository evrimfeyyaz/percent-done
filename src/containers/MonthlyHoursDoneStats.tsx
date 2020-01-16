import React from 'react';
import { StoreState } from '../store/types';
import { HoursDoneStats, PercentDoneStatsProps } from '../components';
import { getTotalCompletedMsForLast30Days } from '../store/goals/selectors';
import { connect } from 'react-redux';

const mapStateToProps = (state: StoreState): PercentDoneStatsProps => ({
  data: getTotalCompletedMsForLast30Days(state),
});

export const MonthlyHoursDoneStats = connect(mapStateToProps)(HoursDoneStats);
