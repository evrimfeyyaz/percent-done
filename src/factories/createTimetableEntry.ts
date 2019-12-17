import { createRandomId } from '../utilities/createRandomId';
import { TimetableEntry } from '../store/timetableEntries/types';

interface CreateTimetableEntryArguments {
  id?: string;
  goalId?: string;
  startDate: Date;
  startHour: number;
  startMinute?: number;
  durationInMin: number;
  projectId?: string;
}

export const createTimetableEntry = ({
                                       id = createRandomId(), goalId = createRandomId(), projectId,
                                       startDate, startHour, startMinute = 0, durationInMin,
                                     }: CreateTimetableEntryArguments): TimetableEntry => {
  const startTimestamp = startDate.setHours(startHour, startMinute);
  const endTimestamp = startTimestamp + durationInMin * 60 * 1000;

  return {
    id,
    goalId,
    startTimestamp,
    endTimestamp,
    projectId,
  };
};
