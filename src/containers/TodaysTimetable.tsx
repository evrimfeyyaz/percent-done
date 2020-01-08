import React from 'react';
import { StoreState } from '../store/types';
import { convertTimetableEntriesToTimetableRows, getTimetableEntriesByDate } from '../store/timetableEntries/selectors';
import { getBeginningOfDay } from '../utilities';
import { connect } from 'react-redux';
import { Timetable, TimetableProps } from '../components';

const today = getBeginningOfDay(new Date());

const mapStateToProps = (state: StoreState): TimetableProps => ({
  entries: convertTimetableEntriesToTimetableRows(state, getTimetableEntriesByDate(state, today)),
});

export const TodaysTimetable = connect(mapStateToProps, null)(Timetable) as any;
