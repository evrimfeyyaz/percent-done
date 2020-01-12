import { Goal } from './src/store/goals/types';
import { createGoal, createStoreState, createTimetableEntry } from './src/factories';
import { TimetableEntry } from './src/store/timetableEntries/types';
import moment from 'moment';

const today = new Date();
const tomorrow = moment(today).add(1, 'day').toDate();
const incompleteGoal: Goal = createGoal({
  title: 'Work on PercentDone',
  durationInMin: 60,
  colorIndex: 0,
}, [today]);
const incompleteGoal2: Goal = createGoal({
  title: 'Exercise',
  durationInMin: undefined,
  colorIndex: 1,
}, [today]);
const longGoal: Goal = createGoal({
  title: 'This is a Goal with a Really Really Really Really Really Really Long Title',
  durationInMin: 60,
  colorIndex: 2,
}, [today]);
const completedGoal: Goal = createGoal({
  title: 'Read',
  durationInMin: undefined,
  colorIndex: 3,
}, [today]);
const tomorrowsGoal: Goal = createGoal({
  title: 'Write an essay',
  durationInMin: 60,
  colorIndex: 4,
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
  goals: [incompleteGoal, incompleteGoal2, longGoal, completedGoal, tomorrowsGoal],
  timetableEntries: [timetableEntry, timetableEntry2],
});

// seedData.goals.trackedGoal = {
//   id: seedData.goals.allIds[0],
//   startTimestamp: Date.now(),
// };

export default seedData;
