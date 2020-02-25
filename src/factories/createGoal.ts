import { createRandomId } from '../utilities';
import { Goal } from '../store/goals/types';

interface CreateGoalParams {
  id?: string;
  title?: string;
  colorIndex?: number;
  durationInMin?: number;
  deletedAt?: Date;
  lastProjectId?: string;
  recurringDates?: Date[];
  recurringEveryDay?: boolean;
}

export const createGoal = ({
                             id = createRandomId(),
                             title = 'Goal',
                             colorIndex = 0,
                             durationInMin = undefined,
                             deletedAt = undefined,
                             lastProjectId,
                             recurringDates,
                             recurringEveryDay = false,
                           }: CreateGoalParams): Goal => {
  const recurringDays = Array(7).fill(false);
  const durationInMs = durationInMin != null ? durationInMin * 60 * 1000 : undefined;

  recurringDates?.map(date => date.getDay()).forEach(dayOfWeek => recurringDays[dayOfWeek] = true);

  return {
    id,
    title,
    colorIndex,
    durationInMs,
    recurringDays: recurringEveryDay ? Array(7).fill(true) : recurringDays,
    createdAtTimestamp: Date.now(),
    deletedAtTimestamp: deletedAt?.getTime(),
    lastProjectId,
  };
};
