import { Goal } from './src/store/goals/types';
import { createGoal, createStoreState, createTimetableEntry } from './src/factories';
import { colors } from './src/theme';
import { TimetableEntry } from './src/store/timetableEntries/types';
import moment from 'moment';

const today = new Date();
const tomorrow = moment(today).add(1, 'day').toDate();
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
const tomorrowsGoal: Goal = createGoal({
  title: 'Write an essay',
  durationInMin: 60,
  color: colors.violet,
}, [tomorrow]);
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
  goals: [incompleteGoal, incompleteGoal2, completedGoal, tomorrowsGoal],
  timetableEntries: [timetableEntry, timetableEntry2],
});

// seedData.goals.trackedGoal = {
//   id: seedData.goals.allIds[0],
//   startTimestamp: Date.now(),
// };

export default seedData;
