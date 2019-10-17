import { Goal } from './src/store/goals/types';
import { createGoal, createStoreState, createTimetableEntry } from './src/factories';
import { colors } from './src/theme';
import { TimetableEntry } from './src/store/timetableEntries/types';

const today = new Date();
const incompleteGoal: Goal = createGoal({
  title: 'Work on PercentDone',
  durationInMin: 60,
  color: colors.orange,
}, [today]);
const incompleteGoal2: Goal = createGoal({
  title: 'Exercise',
  durationInMin: undefined,
  color: colors.citrus,
}, [today]);
const completedGoal: Goal = createGoal({
  title: 'Read',
  durationInMin: undefined,
  color: colors.blue,
}, [today]);
const timetableEntry: TimetableEntry = createTimetableEntry({
  goalId: incompleteGoal.id,
  startHour: 10,
  durationInMin: 30,
  startDate: today,
});
const timetableEntry2: TimetableEntry = createTimetableEntry({
  goalId: completedGoal.id,
  startHour: 10,
  durationInMin: 0,
  startDate: today,
});

const seedData = createStoreState({
  goals: [incompleteGoal, incompleteGoal2, completedGoal],
  timetableEntries: [timetableEntry, timetableEntry2],
});

// seedData.goals.trackedGoal = {
//   id: seedData.goals.allIds[0],
//   startTimestamp: Date.now(),
// };

export default seedData;