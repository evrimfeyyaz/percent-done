import { StoreState } from '../store/types';
import { Goal, GoalsState } from '../store/goals/types';
import { createNormalizedEntityState } from './createNormalizedEntityState';
import { TimetableEntriesState, TimetableEntry } from '../store/timetableEntries/types';
import { convertDateToIndex } from '../utilities';
import { date } from '@storybook/addon-knobs';

interface Arguments {
  goals?: Goal[],
  timetableEntries?: TimetableEntry[],
}

export const createStoreState = ({ goals = [], timetableEntries = [] }: Arguments): StoreState => {
  const timetableEntryIdsByDate: { [date: string]: string[] } = {};
  timetableEntries.forEach((entry) => {
    const dateIdx = convertDateToIndex(new Date(entry.startTimestamp));
    timetableEntryIdsByDate[dateIdx] = timetableEntryIdsByDate[dateIdx] || [];
    timetableEntryIdsByDate[dateIdx].push(entry.id);
  });

  const goalsState: GoalsState = createNormalizedEntityState(goals);
  const timetableEntriesState: TimetableEntriesState = {
    ...createNormalizedEntityState(timetableEntries),
    idsByDate: timetableEntryIdsByDate,
  };

  return {
    goals: goalsState,
    timetableEntries: timetableEntriesState,
  };
};
