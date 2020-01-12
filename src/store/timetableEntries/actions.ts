import {
  DELETE_TIMETABLE_ENTRY,
  DeleteTimetableEntryAction,
  EDIT_TIMETABLE_ENTRY,
  EditTimetableEntryAction,
  TimetableEntry,
} from './types';

export const editTimetableEntry = (timetableEntry: TimetableEntry, oldTimetableEntry: TimetableEntry): EditTimetableEntryAction => ({
  type: EDIT_TIMETABLE_ENTRY,
  timetableEntry,
  oldTimetableEntry,
});

export const deleteTimetableEntry = (timetableEntry: TimetableEntry): DeleteTimetableEntryAction => ({
  type: DELETE_TIMETABLE_ENTRY,
  timetableEntry,
});
