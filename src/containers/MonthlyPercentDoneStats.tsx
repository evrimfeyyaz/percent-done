import React from 'react';
import { StoreState } from '../store/types';
import { PercentDoneStats, PercentDoneStatsProps } from '../components';
import { getTotalProgressForLast30Days } from '../store/goals/selectors';
import { connect } from 'react-redux';

const mapStateToProps = (state: StoreState): PercentDoneStatsProps => ({
  data: getTotalProgressForLast30Days(state),
});

export const MonthlyPercentDoneStats = connect(mapStateToProps)(PercentDoneStats);
