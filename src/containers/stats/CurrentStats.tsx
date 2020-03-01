import React from 'react';
import { StoreState } from '../../store/types';
import { Stats, StatsProps } from '../../components';
import {
  getTotalCompletedMsForLast30Days,
  getTotalCompletedMsForLast7Days, getTotalProgressForLast30Days,
  getTotalProgressForLast7Days, isThereEnoughDataToShowStatisticsOfLastNDays,
} from '../../store/goals/selectors';
import { Dispatch } from 'redux';
import { SettingsActionTypes, StatsPeriodKeyType } from '../../store/settings/types';
import { setStatsPeriodKey } from '../../store/settings/actions';
import { connect } from 'react-redux';

const mapStateToProps = (state: StoreState): StatsProps => ({
  getTotalCompletedMsForLast7Days: () => getTotalCompletedMsForLast7Days(state),
  getTotalCompletedMsForLast30Days: () => getTotalCompletedMsForLast30Days(state),
  getTotalPercentDoneForLast7Days: () => getTotalProgressForLast7Days(state),
  getTotalPercentDoneForLast30Days: () => getTotalProgressForLast30Days(state),
  hasEnoughDataToShow7DaysStats: () => isThereEnoughDataToShowStatisticsOfLastNDays(state, 7, 2),
  hasEnoughDataToShow30DaysStats: () => isThereEnoughDataToShowStatisticsOfLastNDays(state, 30, 9),
  statsPeriodKey: state.settings.statsPeriodKey,
});

const mapDispatchToProps = (dispatch: Dispatch<SettingsActionTypes>): Partial<StatsProps> => ({
  onStatsPeriodKeyChange: (key: StatsPeriodKeyType) => dispatch(setStatsPeriodKey(key)),
});

export const CurrentStats = connect(mapStateToProps, mapDispatchToProps)(Stats);
