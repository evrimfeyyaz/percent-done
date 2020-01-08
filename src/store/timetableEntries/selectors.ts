import { StoreState } from '../types';
import { TimetableEntry } from './types';
import { getGoalById } from '../goals/selectors';
import { getGoalColor, isTimeTracked } from '../goals/utilities';
import { TimetableRow } from '../../components';
import { convertDateToIndex } from '../../utilities';

export const getTimetableEntryById = (state: StoreState, id: string) => {
  return state.timetableEntries.byId[id] || null;
};

export const getTimetableEntriesByDate = (state: StoreState, date: Date): TimetableEntry[] => {
  const dateIdx = convertDateToIndex(date);

  return state.timetableEntries.idsByDate[dateIdx]?.map(id => getTimetableEntryById(state, id)) || [];
};

export const getTimetableEntriesByProjectId = (state: StoreState, projectId: string): TimetableEntry[] => {
  return state.timetableEntries.idsByProjectId[projectId]?.map(id => getTimetableEntryById(state, id));
};

export const convertTimetableEntriesToTimetableRows = (state: StoreState, timetableEntries: TimetableEntry[]): TimetableRow[] => {
  return timetableEntries.map(entry => {
    const goal = getGoalById(state, entry.goalId);

    return ({
      title: goal.title,
      timeTracked: isTimeTracked(goal),
      startTimestamp: entry.startTimestamp,
      endTimestamp: entry.endTimestamp,
      color: getGoalColor(goal),
      id: entry.id,
    });
  });
};
