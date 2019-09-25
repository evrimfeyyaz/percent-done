import { StoreState } from '../types';
import { Goal } from './types';
import { GoalListProps } from '../../components';
import { convertDateToIndex } from '../../utilities';
import { TimetableEntry } from '../timetableEntries/types';
import moment from 'moment';

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

    let completedSeconds, totalSeconds, completed;
    if (goal.durationInSeconds != null) {
      completedSeconds = getCompletedSeconds(state, goal, date);
      totalSeconds = goal.durationInSeconds;
    } else {
      completed = isCompleted(state, goal, date);
    }

    return {
      key: id,
      id,
      title,
      color,
      chainLength,
      completedSeconds,
      totalSeconds,
      isCompleted: completed,
    };
  });

  return {
    goals: convertedGoals,
  };
};

/**
 * Returns the total time spent on a goal for given date.
 */
export const getCompletedSeconds = (state: StoreState, goal: Goal, date: Date): number => {
  const timetableEntries = getTimetableEntriesForGoal(state, goal, date);

  return timetableEntries.reduce((total, entry) => {
    const msSpent = entry.endTimestamp - entry.startTimestamp;

    return total + (msSpent / 1000);
  }, 0);
};

/**
 * Returns the total number of seconds spent on all goals on given day.
 */
export const getTotalCompletedSecondsForDate = (state: StoreState, date: Date): number => {
  const goals = getGoals(state, date);

  return goals.reduce((totalSeconds, goal) => totalSeconds + getCompletedSeconds(state, goal, date), 0);
};

/**
 * Returns the total number of seconds remaining for all goals on given day.
 */
export const getRemainingSecondsForDate = (state: StoreState, date: Date): number => {
  const goals = getGoals(state, date);
  const totalSeconds = goals.reduce((total, goal) => {
    if (goal.durationInSeconds == null) return total;

    return total + goal.durationInSeconds;
  }, 0);
  const completedSeconds = getTotalCompletedSecondsForDate(state, date);

  return Math.max(totalSeconds - completedSeconds, 0);
};

/**
 * Returns whether a goal has been completed on the given day.
 */
export const isCompleted = (state: StoreState, goal: Goal, date: Date): boolean => {
  if (goal.durationInSeconds == null || goal.durationInSeconds === 0) {
    const entries = getTimetableEntriesForGoal(state, goal, date);
    return entries != null && entries.length > 0;
  }

  const completedSeconds = getCompletedSeconds(state, goal, date);
  return completedSeconds >= goal.durationInSeconds;
};

/**
 * Returns the current progress of a goal in percentage (0 to 100).
 */
export const getProgress = (state: StoreState, goal: Goal, date: Date): number => {
  let progress = 0;

  if (goal.durationInSeconds != null) {
    const completedSeconds = getCompletedSeconds(state, goal, date);

    progress = completedSeconds / goal.durationInSeconds;
  } else {
    progress = isCompleted(state, goal, date) ? 1 : 0;
  }

  return progress * 100;
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
  let chainLength = 0;
  for (let daysBefore = 1; daysBefore < 10; daysBefore++) {
    const dateBefore = moment(date).subtract(daysBefore, 'day').toDate();

    if (isCompleted(state, goal, dateBefore)) {
      chainLength++;
    } else {
      break;
    }
  }

  return chainLength;
};
