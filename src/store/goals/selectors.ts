import { StoreState } from '../types';
import { Goal } from './types';
import { GoalListProps } from '../../components';
import { convertDateToIndex } from '../../utilities';
import { TimetableEntry } from '../timetableEntries/types';
import moment from 'moment';
import { isTimeTracked } from './utilities';

export const getGoalById = (state: StoreState, id: string): Goal => {
  return state.goals.byId[id] || null;
};

/**
 * Returns the goals that the user has for a given date.
 */
export const getGoals = (state: StoreState, date: Date): Goal[] => {
  const { goals } = state;
  const dayOfWeek = date.getDay();

  const goalsArr = goals.allIds.map(id => goals.byId[id]);

  return goalsArr.filter(goal => goal.recurringDays[dayOfWeek]);
};

export const getIncompleteGoals = (state: StoreState, date: Date): Goal[] =>
  getGoals(state, date).filter(goal => !isCompleted(state, goal, date));

export const getCompleteGoals = (state: StoreState, date: Date): Goal[] =>
  getGoals(state, date).filter(goal => isCompleted(state, goal, date));

/**
 * Converts an array of goals to GoalListProps to be used in the GoalList component.
 */
export const convertGoalsToGoalListProps = (state: StoreState, goals: Goal[], date: Date): GoalListProps => {
  const convertedGoals = goals.map(goal => {
    const { title, color, id } = goal;
    const chainLength = getChainLength(state, goal, date);

    let completedMs, totalMs, completed;
    if (goal.durationInMs != null) {
      completedMs = getCompletedMs(state, goal, date);
      totalMs = goal.durationInMs;
    } else {
      completed = isCompleted(state, goal, date);
    }

    return {
      id,
      title,
      color,
      chainLength,
      completedMs,
      totalMs,
      isCompleted: completed,
    };
  });

  return {
    goals: convertedGoals,
  };
};

/**
 * Returns the total time spent on a goal for given date in milliseconds.
 */
export const getCompletedMs = (state: StoreState, goal: Goal, date: Date): number => {
  const timetableEntries = getTimetableEntriesForGoal(state, goal, date);

  return timetableEntries.reduce((total, entry) => total + entry.endTimestamp - entry.startTimestamp, 0);
};

/**
 * Returns the total number of milliseconds spent on all goals on given day.
 */
export const getTotalCompletedMsForDate = (state: StoreState, date: Date): number => {
  const goals = getGoals(state, date);

  return goals.reduce((total, goal) => total + getCompletedMs(state, goal, date), 0);
};

/**
 * Returns the remaining time for a goal on a given date in milliseconds.
 */
export const getRemainingMs = (state: StoreState, goal: Goal, date: Date): number => {
  if (!isTimeTracked(goal)) return 0;

  const duration = goal.durationInMs;
  if (duration == null) throw Error('A time-tracked goal cannot have `null` or `undefined` duration.');

  const completedMs = getCompletedMs(state, goal, date);

  return duration - completedMs;
};

/**
 * Returns the total number of milliseconds remaining for all goals on given day.
 */
export const getTotalRemainingMsForDate = (state: StoreState, date: Date): number => {
  const goals = getGoals(state, date);
  const totalMs = goals.reduce((total, goal) => {
    if (goal.durationInMs == null) return total;

    return total + goal.durationInMs;
  }, 0);
  const completedMs = getTotalCompletedMsForDate(state, date);

  return Math.max(totalMs - completedMs, 0);
};

/**
 * Returns whether a goal has been completed on the given day.
 */
export const isCompleted = (state: StoreState, goal: Goal, date: Date): boolean => {
  if (!isTimeTracked(goal)) {
    const entries = getTimetableEntriesForGoal(state, goal, date);
    return entries != null && entries.length > 0;
  }

  if (typeof goal.durationInMs !== 'number') throw Error('A time-tracked goal should have duration.');

  const completedMs = getCompletedMs(state, goal, date);
  return completedMs >= goal.durationInMs;
};

/**
 * Returns the current progress of a goal in percentage (0 to 100).
 */
export const getProgress = (state: StoreState, goal: Goal, date: Date): number => {
  let progress = 0;

  if (goal.durationInMs != null) {
    const completedMs = getCompletedMs(state, goal, date);

    progress = completedMs / goal.durationInMs;
  } else {
    progress = isCompleted(state, goal, date) ? 1 : 0;
  }

  return Math.min(progress * 100, 100);
};

/**
 * Returns the current overall progress for a day in percentage (0 to 100).
 */
export const getTotalProgressForDate = (state: StoreState, date: Date): number => {
  const goals = getGoals(state, date);
  const numOfGoals = goals.length;

  return goals.reduce((progress, goal) => {
    return progress + getProgress(state, goal, date) / numOfGoals;
  }, 0);
};

export const getTimetableEntriesForGoal = (state: StoreState, goal: Goal, date: Date): TimetableEntry[] => {
  const dateIdx = convertDateToIndex(date);
  const entryIds = state.timetableEntries.idsByDate[dateIdx];

  if (entryIds == null) return [];

  return entryIds.reduce((result: TimetableEntry[], entryId) => {
    const entry = state.timetableEntries.byId[entryId];

    if (entry.goalId === goal.id) {
      result.push(entry);
    }

    return result;
  }, []);
};

/**
 * Returns the number of days that given goal has been completed
 * in a row up to today.
 */
export const getChainLength = (state: StoreState, goal: Goal, date: Date): number => {
  let chainLength = isCompleted(state, goal, new Date()) ? 1 : 0;
  for (let daysBefore = 1; true; daysBefore++) {
    const dateBefore = moment(date).subtract(daysBefore, 'day').toDate();

    if (isCompleted(state, goal, dateBefore)) {
      chainLength++;
    } else {
      break;
    }
  }

  return chainLength;
};
