import React from 'react';
import { StoreState } from '../store/types';
import { convertTimetableEntriesToTimetableRows, getTimetableEntries } from '../store/timetableEntries/selectors';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { Timetable, TimetableProps } from '../components';

const today = getBeginningOfDay(new Date());

const mapStateToProps = (state: StoreState): TimetableProps => ({
  entries: convertTimetableEntriesToTimetableRows(state, getTimetableEntries(state, today)),
});

export const TodaysTimetable = connect(mapStateToProps, null)(Timetable) as any;
