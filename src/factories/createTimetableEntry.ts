import { createRandomId } from '../store/utilities';
import { TimetableEntry } from '../store/timetableEntries/types';

interface CreateTimetableEntryArguments {
  id?: string;
  goalId?: string;
  startDate: Date;
  startHour: number;
  startMinute?: number;
  durationInMin: number;
}

export const createTimetableEntry = ({
                                       id = createRandomId(), goalId = createRandomId(),
                                       startDate, startHour, startMinute = 0, durationInMin,
                                     }: CreateTimetableEntryArguments): TimetableEntry => {
  const startTime = startDate.setHours(startHour, startMinute);
  const endTime = startTime + durationInMin * 60 * 1000;

  return {
    id,
    goalId,
    startTime,
    endTime,
  };
};
