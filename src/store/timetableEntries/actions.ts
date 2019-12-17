import {
  ADD_TIMETABLE_ENTRY,
  DELETE_TIMETABLE_ENTRY,
  AddTimetableEntryAction,
  DeleteTimetableEntryAction,
  TimetableEntry,
} from './types';

export const addTimetableEntry = (timetableEntry: TimetableEntry): AddTimetableEntryAction => ({
  type: ADD_TIMETABLE_ENTRY,
  timetableEntry,
});

export const deleteTimetableEntry = (timetableEntry: TimetableEntry): DeleteTimetableEntryAction => ({
  type: DELETE_TIMETABLE_ENTRY,
  timetableEntry,
});
