import { createRandomId } from '../store/utilities';
import { colors } from '../theme';
import { Goal } from '../store/goals/types';

export const createGoal = ({
                             id = createRandomId(),
                             title = 'Goal',
                             color = colors.orange,
                             isTimeTracked = true,
                             durationInSeconds = 3600,
                             hasReminder = false,
                             reminderTime = undefined,
                             chainLength = 0,
                             timetableEntryIdsByDate = {},
                           }, dates?: Date[]): Goal => {
  const recurringDays = Array(7).fill(false);

  if (dates != null) {
    dates
      .map(date => date.getDay())
      .forEach(dayOfWeek => recurringDays[dayOfWeek] = true);
  }

  return {
    id,
    title,
    color,
    isTimeTracked,
    durationInSeconds,
    recurringDays,
    hasReminder,
    reminderTime,
    chainLength,
    timetableEntryIds: {
      byDate: timetableEntryIdsByDate,
    },
  };
};
