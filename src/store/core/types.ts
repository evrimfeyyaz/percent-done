import { NormalizedEntity } from '../types';

export interface Goal {
  id: string;
  title: string;
  color: string;

  isTimeTracked: boolean;
  /**
   * Total duration of the goal in seconds.
   */
  duration?: number;

  /**
   * Days that the goal should be recurring.
   * 0 is for Sunday and 6 is for Saturday.
   */
  recurringDays: boolean[];

  hasReminder: boolean;
  reminderTime?: Date;

  timetableEntryIdsByDate: {
    [date: string]: string[],
  }
}

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

export interface CoreState {
  goals: NormalizedEntity<Goal>,
  timetableEntries: NormalizedEntity<TimetableEntry> & { IdsByDate: { [date: string]: number[] } }
}
