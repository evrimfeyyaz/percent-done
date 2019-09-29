import {
  ADD_TIMETABLE_ENTRY,
  AddTimetableEntryAction,
  REMOVE_TIMETABLE_ENTRY,
  RemoveTimetableEntry,
  TimetableEntry,
} from './types';
import { ActionCreator } from 'redux';

export const addTimetableEntry: ActionCreator<AddTimetableEntryAction> = (timetableEntry: TimetableEntry) => ({
  type: ADD_TIMETABLE_ENTRY,
  timetableEntry,
});

export const removeTimetableEntry: ActionCreator<RemoveTimetableEntry> = (timetableEntry: TimetableEntry) => ({
  type: REMOVE_TIMETABLE_ENTRY,
  timetableEntry,
});
