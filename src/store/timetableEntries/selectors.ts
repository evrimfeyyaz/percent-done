import { StoreState } from '../types';
import { TimetableEntry } from './types';
import { getGoalById } from '../goals/selectors';
import { isTimeTracked } from '../goals/utilities';
import { TimetableRow } from '../../components';
import { convertDateToIndex } from '../../utilities';

export const getTimetableEntryById = (state: StoreState, id: string) => {
  return state.timetableEntries.byId[id] || null;
};

export const getTimetableEntries = (state: StoreState, date: Date): TimetableEntry[] => {
  const dateIdx = convertDateToIndex(date);

  return state.timetableEntries.idsByDate[dateIdx]?.map(id => getTimetableEntryById(state, id)) || [];
};

export const convertTimetableEntriesToTimetableRows = (state: StoreState, timetableEntries: TimetableEntry[]): TimetableRow[] => {
  return timetableEntries.map(entry => {
    const goal = getGoalById(state, entry.goalId);
    const startTime = new Date(entry.startTimestamp);
    const endTime = new Date(entry.endTimestamp);

    return ({
      title: goal.title,
      timeTracked: isTimeTracked(goal),
      startHour: startTime.getHours(),
      startMinute: startTime.getMinutes(),
      endHour: endTime.getHours(),
      endMinute: endTime.getMinutes(),
      color: goal.color,
      id: entry.id,
    });
  });
};
