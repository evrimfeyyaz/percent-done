import { NormalizedEntityState } from '../types';
import { Action } from 'redux';

export interface TimetableEntry {
  id: string,
  goalId: string,
  /**
   * In milliseconds since the Unix Epoch.
   */
  startTimestamp: number,
  /**
   * In milliseconds since the Unix Epoch.
   */
  endTimestamp: number,
}

export interface TimetableEntriesState extends NormalizedEntityState<TimetableEntry> {
  idsByDate: { [date: string]: string[] }
}

export const ADD_TIMETABLE_ENTRY = 'ADD_TIMETABLE_ENTRY';
export const REMOVE_TIMETABLE_ENTRY = 'REMOVE_TIMETABLE_ENTRY';

export interface AddTimetableEntryAction extends Action<typeof ADD_TIMETABLE_ENTRY> {
  timetableEntry: TimetableEntry;
}

export interface RemoveTimetableEntry extends Action<typeof REMOVE_TIMETABLE_ENTRY> {
  timetableEntry: TimetableEntry;
}

export type TimetableEntryActionTypes = AddTimetableEntryAction | RemoveTimetableEntry;
