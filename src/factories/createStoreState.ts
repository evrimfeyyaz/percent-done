import { StoreState } from '../store/types';
import { Goal } from '../store/goals/types';
import { createNormalizedEntityState } from './createNormalizedEntityState';
import { TimetableEntry } from '../store/timetableEntries/types';
import { convertDateToIndex } from '../utilities';

interface Arguments {
  goals?: Goal[],
  timetableEntries?: TimetableEntry[],
}

export const createStoreState = ({ goals = [], timetableEntries = [] }: Arguments): StoreState => {
  addTimetableEntryReferencesToGoals(goals, timetableEntries);

  return {
    goals: createNormalizedEntityState(goals),
    timetableEntries: createNormalizedEntityState(timetableEntries),
  };
};

const addTimetableEntryReferencesToGoals = (goals: Goal[], timetableEntries: TimetableEntry[]) => {
  timetableEntries.forEach(entry => {
    const referencedGoal = goals.find(goal => goal.id === entry.goalId);
    const entryDate = new Date(entry.startTime);
    const entryDateIdx = convertDateToIndex(entryDate);

    if (referencedGoal == null) return;

    // TODO: Refactor adding indexes here to its own function.
    if (referencedGoal.timetableEntryIds.byDate[entryDateIdx] == null) {
      referencedGoal.timetableEntryIds.byDate[entryDateIdx] = [];
    }

    referencedGoal.timetableEntryIds.byDate[entryDateIdx].push(entry.id);
  });
};
