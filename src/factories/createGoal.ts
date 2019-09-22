import { createRandomId } from '../utilities/createRandomId';
import { colors } from '../theme';
import { Goal } from '../store/goals/types';

interface CreateGoalParams {
  id?: string,
  title?: string,
  color?: string,
  durationInMin?: number,
  reminderTime?: Date,
}

export const createGoal = ({
                             id = createRandomId(),
                             title = 'Goal',
                             color = colors.orange,
                             durationInMin = undefined,
                             reminderTime = undefined,
                           }: CreateGoalParams, dates?: Date[]): Goal => {
  const recurringDays = Array(7).fill(false);
  const durationInSeconds = durationInMin != null ? durationInMin * 60 : undefined;

  if (dates != null) {
    dates
      .map(date => date.getDay())
      .forEach(dayOfWeek => recurringDays[dayOfWeek] = true);
  }


  return {
    id,
    title,
    color,
    durationInSeconds,
    recurringDays,
    reminderTime,
  };
};
