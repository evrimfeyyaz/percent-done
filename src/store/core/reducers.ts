import { CoreState, Goal, TimetableEntry } from './types';
import { convertDateToIndex } from '../../utilities';
import { GoalsListProps } from '../../components';

const initialState: CoreState = {
  goals: {
    byId: {},
    allIds: [],
  },
  timetableEntries: {
    byId: {},
    allIds: [],
    IdsByDate: {},
  },
};

export function coreReducer(state = initialState, action) {
}

/**
 * Returns an array of goals that should be visible in a given day.
 */
function getGoalsByDate(state: CoreState, date: Date) {
  const dayOfWeek = date.getDay();
  const { goals } = state;

  return goals.allIds
    .map(id => goals.byId[id])
    .filter(goal => goal.recurringDays[dayOfWeek]);
}

export function getGoalsByDateAsGoalListProps(state: CoreState, date: Date): GoalsListProps {
  const goals = getGoalsByDate(state, date);

  goals.map(goal => ({
    name: goal.title,
    color: goal.color,
    chainLength:,
  }));
}

function getChainLength(state: CoreState, goal: Goal) {
  const entryDates = Object.keys(goal.timetableEntryIdsByDate);

  entryDates.sort((dateIdx1: string, dateIdx2: string) => )
}

/**
 * Returns whether or not a goal is completed on a given date.
 */
function isGoalCompleted(state: CoreState, goal: Goal, date: Date): boolean {
  const dateIndex = convertDateToIndex(date);
  const todaysEntries = goal.timetableEntryIdsByDate[dateIndex];

  if (todaysEntries == null) return false;

  if (goal.isTimeTracked && goal.duration != null) {
    const spentSeconds = totalSecondsSpentOnGoal(state, goal, date);

    return spentSeconds >= goal.duration;
  } else {
    return todaysEntries.length > 0;
  }
}

function totalSecondsSpentOnGoal(state: CoreState, goal: Goal, date: Date) {
  const dateIndex = convertDateToIndex(date);
  const timetableEntryIds = goal.timetableEntryIdsByDate[dateIndex];
  const { timetableEntries } = state;

  if (timetableEntryIds == null) return 0;

  return goal.timetableEntryIdsByDate[dateIndex].reduce((total, entryId) => {
    const entry = timetableEntries.byId[entryId];
    return total + timetableEntryDurationInSeconds(entry);
  }, 0);
}

function goalProgressPercent(state: CoreState, goal: Goal, date: Date) {
  const { timetableEntries } = state;

  if (timetableEntries == null) return 0;
  if (goal.duration == null) return 0;

  const totalDuration = goal.duration;
  const secondsSpent = totalSecondsSpentOnGoal(state, goal, date);

  return Math.round(secondsSpent / totalDuration * 100);
}

function timetableEntryDurationInSeconds(entry: TimetableEntry) {
  return (entry.endTime - entry.startTime) / 1000;
}
