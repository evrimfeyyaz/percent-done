import { StoreState } from './types';

export const storeMigrations = {
  0: (state: StoreState) => {
    // Add `idsByGoalId` to timetable entries.
    const idsByGoalId: typeof state.timetableEntries.idsByGoalId = {};

    const goalIds = state.goals.allIds;
    goalIds.forEach(goalId => {
      const entryIdsForGoal = state.timetableEntries.allIds.filter(id => state.timetableEntries.byId[id].goalId === goalId);

      idsByGoalId[goalId] = entryIdsForGoal;
    });

    return {
      ...state,
      timetableEntries: {
        ...state.timetableEntries,
        idsByGoalId,
      },
    };
  },
};
