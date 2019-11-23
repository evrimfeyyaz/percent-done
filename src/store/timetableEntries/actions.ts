import {
  ADD_TIMETABLE_ENTRY,
  AddTimetableEntryAction, EDIT_TIMETABLE_ENTRY, EditTimetableEntryAction,
  DELETE_TIMETABLE_ENTRY,
  DeleteTimetableEntry,
  TimetableEntry,
} from './types';
import { ActionCreator } from 'redux';

export const addTimetableEntry: ActionCreator<AddTimetableEntryAction> = (timetableEntry: TimetableEntry) => ({
  type: ADD_TIMETABLE_ENTRY,
  timetableEntry,
});

export const editTimetableEntry: ActionCreator<EditTimetableEntryAction> = (timetableEntry: TimetableEntry) => ({
  type: EDIT_TIMETABLE_ENTRY,
  timetableEntry,
});

export const deleteTimetableEntry: ActionCreator<DeleteTimetableEntry> = (timetableEntryId: string, timetableEntryStartTimestamp: number) => ({
  type: DELETE_TIMETABLE_ENTRY,
  timetableEntryId,
  timetableEntryStartTimestamp,
});
