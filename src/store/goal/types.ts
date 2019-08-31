export const GET_INCOMPLETE_GOALS = 'goal/get-incomplete-goals';

export interface Goal {
  title: string;
  dateAdded: Date;
  isTimeTracked: boolean;
  /**
   * Total duration of the goal in minutes.
   */
  duration: number;
  isRecurring: boolean;
  /**
   * Days that the goal should be recurring by index.
   * 0 is for Sunday and 6 is for Saturday.
   */
  recurringDays: boolean[];
  hasReminder: boolean;
  reminderTime: Date;
  color: string;
  timetableEntryIds: number[];
}
