import { StoreState } from '../types';
import { Goal } from './types';
import { GoalRowProps, StatChartData } from '../../components';
import {
  convertDateToIndex,
  getAbbreviatedDate,
  getAbbreviatedDayOfWeek,
  momentWithDeviceLocale,
} from '../../utilities';
import { TimetableEntry } from '../timetableEntries/types';
import { getGoalColor, isActiveToday, isCreated, isDeleted, isTimeTracked } from './utilities';
import { getTimetableEntriesByDate } from '../timetableEntries/selectors';

export function getGoalById(state: StoreState, id: string): Goal {
  return state.goals.byId[id];
}

/**
 * Returns all goals. By default, it doesn't return deleted goals.
 */
export function getAllGoals(state: StoreState, options?: { includeDeleted: boolean }): Goal[] {
  const allGoals = state.goals.allIds.map(id => getGoalById(state, id));

  if (options?.includeDeleted) {
    return allGoals;
  }

  return allGoals.filter(goal => goal.deletedAtTimestamp == null);
}

/**
 * Returns the goals that the user has for a given date.
 */
export function getGoalsForDate(state: StoreState, date: Date): Goal[] {
  const { goals } = state;
  const dayOfWeek = date.getDay();

  const goalsArr = goals.allIds.map(id => goals.byId[id]);

  return goalsArr.filter(goal => !isDeleted(goal, date) && isCreated(goal, date) && goal.recurringDays[dayOfWeek]);
}

export const getIncompleteGoals = (state: StoreState, date: Date): Goal[] =>
  getGoalsForDate(state, date).filter(goal => !isCompleted(state, goal, date));

export const getCompleteGoals = (state: StoreState, date: Date): Goal[] =>
  getGoalsForDate(state, date).filter(goal => isCompleted(state, goal, date));

/**
 * Converts an array of goals to a GoalRowProps array to be used in the GoalList component.
 */
export function convertGoalsToGoalRowProps(state: StoreState, goals: Goal[], date: Date): GoalRowProps[] {
  return goals.map(goal => {
    const { title, id } = goal;
    const chainLength = getChainLength(state, goal, date);
    const activeToday = isActiveToday(goal);

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
      color: getGoalColor(goal),
      chainLength,
      completedMs,
      totalMs,
      isActiveToday: activeToday,
      isCompleted: completed,
    };
  });
}

/**
 * Returns the total time spent on a goal for given date in milliseconds.
 */
export function getCompletedMs(state: StoreState, goal: Goal, date: Date): number {
  const timetableEntries = getTimetableEntriesForGoal(state, goal, date);

  return timetableEntries.reduce((total, entry) => total + entry.endTimestamp - entry.startTimestamp, 0);
}

/**
 * Returns the total number of milliseconds spent on all goals on given day.
 */
export function getTotalCompletedMsForDate(state: StoreState, date: Date): number | null {
  const goals = getGoalsForDate(state, date);

  if (goals.length === 0) return null;

  return goals.reduce((total, goal) => total + getCompletedMs(state, goal, date), 0);
}

/**
 * Returns the remaining time for a goal on a given date in milliseconds.
 */
export function getRemainingMs(state: StoreState, goal: Goal, date: Date): number | null {
  if (!isTimeTracked(goal) || !isScheduled(state, goal.id, date)) return null;

  const duration = goal.durationInMs;
  if (duration == null) throw Error('A time-tracked goal cannot have `null` or `undefined` duration.');

  const completedMs = getCompletedMs(state, goal, date);

  return duration - completedMs;
}

/**
 * Returns the total number of milliseconds remaining for all goals on given day.
 */
export function getTotalRemainingMsForDate(state: StoreState, date: Date): number {
  const goals = getGoalsForDate(state, date);
  const totalMs = goals.reduce((total, goal) => {
    if (goal.durationInMs == null) return total;

    return total + goal.durationInMs;
  }, 0);
  const completedMs = getTotalCompletedMsForDate(state, date) ?? 0;

  return Math.max(totalMs - completedMs, 0);
}

/**
 * Returns whether a goal has been completed on the given day.
 */
export function isCompleted(state: StoreState, goal: Goal, date: Date): boolean {
  if (!isTimeTracked(goal)) {
    const entries = getTimetableEntriesForGoal(state, goal, date);
    return entries != null && entries.length > 0;
  }

  if (typeof goal.durationInMs !== 'number') throw Error('A time-tracked goal should have duration.');

  const completedMs = getCompletedMs(state, goal, date);
  return completedMs >= goal.durationInMs;
}

export function isScheduled(state: StoreState, goalId: string, date: Date): boolean {
  const scheduledGoals = getGoalsForDate(state, date);

  return scheduledGoals.map(goal => goal.id).includes(goalId);
}

/**
 * Returns the current progress of a goal in percentage (0 to 100).
 */
export function getProgress(state: StoreState, goal: Goal, date: Date): number {
  let progress;

  if (goal.durationInMs != null) {
    const completedMs = getCompletedMs(state, goal, date);

    progress = completedMs / goal.durationInMs;
  } else {
    progress = isCompleted(state, goal, date) ? 1 : 0;
  }

  return Math.min(progress * 100, 100);
}

/**
 * Returns the current overall progress for a day in percentage (0 to 100).
 */
export function getTotalProgressForDate(state: StoreState, date: Date): number | null {
  const goals = getGoalsForDate(state, date);
  const numOfGoals = goals.length;

  if (numOfGoals === 0) return null;

  return goals.reduce((progress, goal) => {
    return progress + getProgress(state, goal, date) / numOfGoals;
  }, 0);
}

export function getTimetableEntriesForGoal(state: StoreState, goal: Goal, date: Date): TimetableEntry[] {
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
}

/**
 * Returns the number of days that given goal has been completed
 * in a row up to today.
 */
export function getChainLength(state: StoreState, goal: Goal, date: Date): number {
  let chainLength = isCompleted(state, goal, new Date()) ? 1 : 0;
  for (let daysBefore = 1; true; daysBefore++) {
    const dateBefore = momentWithDeviceLocale(date).subtract(daysBefore, 'day').toDate();

    if (isCompleted(state, goal, dateBefore)) {
      chainLength++;
    } else {
      break;
    }
  }

  return chainLength;
}

export const getTotalProgressForLast7Days = (state: StoreState): StatChartData =>
  getStatsForLastNDays(state, 7, getAbbreviatedDayOfWeek, getTotalProgressForDate);

export const getTotalProgressForLast30Days = (state: StoreState): StatChartData =>
  getStatsForLastNDays(state, 30, getAbbreviatedDate, getTotalProgressForDate);

export const getTotalCompletedMsForLast7Days = (state: StoreState): StatChartData =>
  getStatsForLastNDays(state, 7, getAbbreviatedDayOfWeek, getTotalCompletedMsForDate);

export const getTotalCompletedMsForLast30Days = (state: StoreState): StatChartData =>
  getStatsForLastNDays(state, 30, getAbbreviatedDate, getTotalCompletedMsForDate);

function getStatsForLastNDays(
  state: StoreState,
  numOfDays: number,
  labelSelector: ((date: Date) => string),
  valueSelector: ((state: StoreState, date: Date) => number | null),
): StatChartData {
  const moment = momentWithDeviceLocale();

  const result: StatChartData = [];
  for (let i = 1; i <= numOfDays; i++) {
    moment.subtract(1, 'day');
    const date = moment.toDate();

    result.unshift({
      label: labelSelector(date),
      value: valueSelector(state, date),
    });
  }

  return result;
}

export function isThereEnoughDataToShowStatisticsOfLastNDays(
  state: StoreState,
  numOfDays: number,
  minNumOfDaysToShowStats: number,
): boolean {
  const moment = momentWithDeviceLocale(new Date());
  let numOfDaysWithGoals = 0;
  let numOfDaysWithTimetableEntries = 0;

  for (let i = 1; i <= numOfDays; i++) {
    const date = moment.subtract(1, 'day').toDate();
    const goals = getGoalsForDate(state, date);
    const timetableEntries = getTimetableEntriesByDate(state, date);

    if (goals.length > 0) numOfDaysWithGoals++;
    if (timetableEntries.length > 0) numOfDaysWithTimetableEntries++;
  }

  if (numOfDaysWithGoals <= minNumOfDaysToShowStats) {
    return false;
  }

  if (numOfDaysWithTimetableEntries <= minNumOfDaysToShowStats) {
    return false;
  }

  return true;
}
