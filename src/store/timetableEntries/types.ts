import { NormalizedEntityState } from '../types';
import { Action } from 'redux';

export interface TimetableEntry {
  id: string;
  goalId: string;
  projectId?: string;
  /**
   * In milliseconds since the Unix Epoch.
   */
  startTimestamp: number;
  /**
   * In milliseconds since the Unix Epoch.
   */
  endTimestamp: number;
}

export interface TimetableEntriesState extends NormalizedEntityState<TimetableEntry> {
  idsByDate: { [date: string]: string[] }
}

export const ADD_TIMETABLE_ENTRY = 'ADD_TIMETABLE_ENTRY';
export const EDIT_TIMETABLE_ENTRY = 'EDIT_TIMETABLE_ENTRY';
export const DELETE_TIMETABLE_ENTRY = 'DELETE_TIMETABLE_ENTRY';

export interface AddTimetableEntryAction extends Action<typeof ADD_TIMETABLE_ENTRY> {
  timetableEntry: TimetableEntry;
}

export interface EditTimetableEntryAction extends Action<typeof EDIT_TIMETABLE_ENTRY> {
  timetableEntry: TimetableEntry;
}

export interface DeleteTimetableEntryAction extends Action<typeof DELETE_TIMETABLE_ENTRY> {
  timetableEntryId: string;
  timetableEntryStartTimestamp: number;
}

export type TimetableEntryActionTypes =
  AddTimetableEntryAction |
  EditTimetableEntryAction |
  DeleteTimetableEntryAction;
