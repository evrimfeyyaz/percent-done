import { ADD_TIMETABLE_ENTRY, AddTimetableEntryAction, TimetableEntry } from './types';
import { ActionCreator } from 'redux';

export const addTimetableEntry: ActionCreator<AddTimetableEntryAction> = (timetableEntry: TimetableEntry) => ({
  type: ADD_TIMETABLE_ENTRY,
  timetableEntry,
});
