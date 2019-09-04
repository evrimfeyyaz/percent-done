import { TimetableEntry } from '../../src/store/core/types';
import { createRandomId } from '../../src/store/utilities';

export const createTimetableEntry = ({
                                       id = createRandomId(),
                                       goalId = createRandomId(),
                                       startTime = new Date().getTime(),
                                       endTime = new Date().getTime() + (60 * 60 * 1000),
                                     }): TimetableEntry => ({
  id, goalId, startTime, endTime,
});
