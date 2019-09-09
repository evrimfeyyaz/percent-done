import { NormalizedEntityState } from '../types';

export interface Goal {
  id: string;
  title: string;
  color: string;

  isTimeTracked: boolean;
  /**
   * Total duration of the goal in seconds.
   */
  durationInSeconds?: number;

  /**
   * Days that the goal should be recurring.
   * 0 is for Sunday and 6 is for Saturday.
   */
  recurringDays: boolean[];

  hasReminder: boolean;
  reminderTime?: Date;

  chainLength: number;

  timetableEntryIds: {
    byDate: {
      [date: string]: string[],
    }
  }
}

export interface GoalsState extends NormalizedEntityState<Goal> {
}
