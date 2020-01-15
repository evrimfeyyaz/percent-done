import React from 'react';
import { StoreState } from '../store/types';
import { PercentDoneStats, PercentDoneStatsProps } from '../components';
import { getTotalProgressForLast7Days } from '../store/goals/selectors';
import { connect } from 'react-redux';

const mapStateToProps = (state: StoreState): PercentDoneStatsProps => ({
  data: getTotalProgressForLast7Days(state),
});

export const WeeklyPercentDoneStats = connect(mapStateToProps)(PercentDoneStats);
