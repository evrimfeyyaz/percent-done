import { NormalizedEntityState } from '../types';

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
