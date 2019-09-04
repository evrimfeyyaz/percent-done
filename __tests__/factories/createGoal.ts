import { Goal } from '../../src/store/core/types';
import { createRandomId } from '../../src/store/utilities';
import { colors } from '../../src/theme';

export const createGoal = ({
                             id = createRandomId(),
                             title = 'Goal',
                             color = colors.orange,
                             isTimeTracked = true,
                             duration = 3600,
                             recurringDays = Array(7).fill(true),
                             hasReminder = false,
                             reminderTime = undefined,
                             timetableEntryIdsByDate = {},
                           }): Goal => ({
  id,
  title,
  color,
  isTimeTracked,
  duration,
  recurringDays,
  hasReminder,
  reminderTime,
  timetableEntryIdsByDate,
});
