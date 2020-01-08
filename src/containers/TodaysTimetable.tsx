import React from 'react';
import { StoreState } from '../store/types';
import { convertTimetableEntriesToTimetableRows, getTimetableEntriesByDate } from '../store/timetableEntries/selectors';
import { connect } from 'react-redux';
import { Timetable, TimetableProps } from '../components';
import { getCurrentDate } from '../store/settings/selectors';

const mapStateToProps = (state: StoreState): TimetableProps => {
  const currentDate = getCurrentDate(state);

  return {
    entries: convertTimetableEntriesToTimetableRows(state, getTimetableEntriesByDate(state, currentDate)),
  }
};

export const TodaysTimetable = connect(mapStateToProps, null)(Timetable) as any;
