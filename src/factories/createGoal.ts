import { createRandomId } from '../utilities';
import { colors } from '../theme';
import { Goal } from '../store/goals/types';

interface CreateGoalParams {
  id?: string;
  title?: string;
  color?: string;
  durationInMin?: number;
  deletedAt?: Date;
}

export const createGoal = ({
                             id = createRandomId(),
                             title = 'Goal',
                             color = colors.orange,
                             durationInMin = undefined,
                             deletedAt = undefined,
                           }: CreateGoalParams, dates?: Date[]): Goal => {
  const recurringDays = Array(7).fill(false);
  const durationInMs = durationInMin != null ? durationInMin * 60 * 1000 : undefined;

  dates?.map(date => date.getDay()).forEach(dayOfWeek => recurringDays[dayOfWeek] = true);

  return {
    id,
    title,
    color,
    durationInMs,
    recurringDays,
    createdAt: new Date(),
    deletedAt,
  };
};
