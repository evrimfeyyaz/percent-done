import { NormalizedEntityState } from '../types';

export interface TimetableEntry {
  id: string,
  goalId: string,
  /**
   * In milliseconds since the Unix Epoch.
   */
  startTime: number,
  /**
   * In milliseconds since the Unix Epoch.
   */
  endTime: number,
}

export interface TimetableEntriesState extends NormalizedEntityState<TimetableEntry> {
  idsByDate: { [date: string]: string[] }
}
