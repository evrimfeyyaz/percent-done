import {
  ADD_TIMETABLE_ENTRY,
  EDIT_TIMETABLE_ENTRY,
  DELETE_TIMETABLE_ENTRY,
  AddTimetableEntryAction,
  EditTimetableEntryAction,
  DeleteTimetableEntryAction,
  TimetableEntry,
} from './types';

export const addTimetableEntry = (timetableEntry: TimetableEntry): AddTimetableEntryAction => ({
  type: ADD_TIMETABLE_ENTRY,
  timetableEntry,
});

export const editTimetableEntry = (timetableEntry: TimetableEntry): EditTimetableEntryAction => ({
  type: EDIT_TIMETABLE_ENTRY,
  timetableEntry,
});

export const deleteTimetableEntry = (timetableEntryId: string, timetableEntryStartTimestamp: number): DeleteTimetableEntryAction => ({
  type: DELETE_TIMETABLE_ENTRY,
  timetableEntryId,
  timetableEntryStartTimestamp,
});
