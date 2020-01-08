import { createRandomId } from '../utilities';
import { Goal } from '../store/goals/types';

interface CreateGoalParams {
  id?: string;
  title?: string;
  colorIndex?: number;
  durationInMin?: number;
  deletedAt?: Date;
}

export const createGoal = ({
                             id = createRandomId(),
                             title = 'Goal',
                             colorIndex = 0,
                             durationInMin = undefined,
                             deletedAt = undefined,
                           }: CreateGoalParams, dates?: Date[]): Goal => {
  const recurringDays = Array(7).fill(false);
  const durationInMs = durationInMin != null ? durationInMin * 60 * 1000 : undefined;

  dates?.map(date => date.getDay()).forEach(dayOfWeek => recurringDays[dayOfWeek] = true);

  return {
    id,
    title,
    colorIndex,
    durationInMs,
    recurringDays,
    createdAtTimestamp: Date.now(),
    deletedAtTimestamp: deletedAt?.getTime(),
  };
};
