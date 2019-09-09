import { StoreState } from '../types';
import { Goal } from './types';
import { GoalListProps } from '../../components';
import { convertDateToIndex } from '../../utilities';

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
    const { title, color, chainLength, id: key } = goal;

    const completedSeconds = getCompletedSeconds(state, goal, date);
    const completed = isCompleted(state, goal, date);

    return {
      key,
      title,
      color,
      chainLength,
      completedSeconds,
      totalSeconds: goal.durationInSeconds,
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
const getCompletedSeconds = (state: StoreState, goal: Goal, date: Date): number => {
  const dateIdx = convertDateToIndex(date);
  const timetableEntryIds = goal.timetableEntryIds.byDate[dateIdx];

  if (timetableEntryIds == null) return 0;

  return timetableEntryIds.reduce((total, id) => {
    const timetableEntry = state.timetableEntries.byId[id];

    if (timetableEntry == null) {
      throw Error('Cannot find timetable entry');
    }

    const msSpent = timetableEntry.endTime - timetableEntry.startTime;

    return total + (msSpent / 1000);
  }, 0);
};

/**
 * Returns whether a goal has been completed on the given day.
 */
export const isCompleted = (state: StoreState, goal: Goal, date: Date): boolean => {
  if (goal.isTimeTracked) {
    const completedSeconds = getCompletedSeconds(state, goal, date);
    const totalSeconds = goal.durationInSeconds;

    if (totalSeconds == null) {
      throw Error('A time tracked goal should have a set duration.');
    }

    return completedSeconds >= totalSeconds;
  } else {
    const dateIdx = convertDateToIndex(date);
    const entries = goal.timetableEntryIds.byDate[dateIdx];

    return entries != null && entries.length > 0;
  }
};
