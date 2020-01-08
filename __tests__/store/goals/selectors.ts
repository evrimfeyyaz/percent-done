import { createGoal, createStoreState, createTimetableEntry } from '../../../src/factories';
import {
  convertGoalsToGoalRowProps,
  getAllGoals,
  getChainLength,
  getCompletedMs,
  getCompleteGoals,
  getGoalById,
  getGoalsForDate,
  getIncompleteGoals,
  getProgress,
  getRemainingMs,
  getTimetableEntriesForGoal,
  getTotalCompletedMsForDate,
  getTotalProgressForDate,
  getTotalRemainingMsForDate,
  isCompleted,
} from '../../../src/store/goals/selectors';
import { GoalRowProps } from '../../../src/components';
import moment from 'moment';
import { Goal } from '../../../src/store/goals/types';

describe('goals selectors', () => {
  const today = new Date();

  describe('getGoalById', () => {
    it('returns the goal with given ID', () => {
      const goal = createGoal({});
      const goalId = goal.id;
      const state = createStoreState({ goals: [goal] });

      const returnedGoal = getGoalById(state, goalId);

      expect(returnedGoal).toEqual(goal);
    });

    it('returns `undefined` if no goal exists with given ID', () => {
      const goalId = 'non-existent-goal-id';
      const state = createStoreState({});

      const returnedGoal = getGoalById(state, goalId);

      expect(returnedGoal).toBeUndefined();
    });
  });

  describe('getAllGoals', () => {
    it('returns all goals', () => {
      const goal1 = createGoal({});
      const goal2 = createGoal({});
      const state = createStoreState({ goals: [goal1, goal2] });

      const result = getAllGoals(state);

      expect(result).toEqual([goal1, goal2]);
    });

    it('does not return deleted goals', () => {
      const goal = createGoal({});
      const deletedGoal = createGoal({ deletedAt: new Date() });
      const state = createStoreState({ goals: [goal, deletedGoal] });

      const result = getAllGoals(state);

      expect(result).toEqual([goal]);
    });

    it('returns deleted goals when relevant option is provided', () => {
      const goal = createGoal({});
      const deletedGoal = createGoal({ deletedAt: new Date() });
      const state = createStoreState({ goals: [goal, deletedGoal] });

      const result = getAllGoals(state, { includeDeleted: true });

      expect(result).toEqual([goal, deletedGoal]);
    });
  });

  describe('getGoalsForDate', () => {
    const tomorrow = moment(today).add(1, 'day').toDate();
    let goal: Goal;

    beforeEach(() => {
      goal = createGoal({}, [today]);
    });

    it('returns all goals that should be completed for given date', () => {
      const goalForTomorrow = createGoal({}, [tomorrow]);

      const state = createStoreState({ goals: [goal, goalForTomorrow] });

      const result = getGoalsForDate(state, today);

      expect(result).toContain(goal);
      expect(result).not.toContain(goalForTomorrow);
    });

    it('does not return deleted goals if they were deleted before given date', () => {
      goal.deletedAtTimestamp = moment(today).subtract(1, 'day').toDate();
      const state = createStoreState({ goals: [goal] });

      const result = getGoalsForDate(state, today);

      expect(result).toEqual([]);
    });

    it('returns deleted goals if they were deleted after given date', () => {
      goal.deletedAtTimestamp = tomorrow;
      const state = createStoreState({ goals: [goal] });

      const result = getGoalsForDate(state, today);

      expect(result).toEqual([goal]);
    });
  });

  describe('getIncompleteGoals and getCompleteGoals', () => {
    it('returns only incomplete or complete goals', () => {
      const completedGoal = createGoal({ durationInMin: undefined }, [today]);
      const incompleteGoal = createGoal({ durationInMin: undefined }, [today]);

      const timetableEntry = createTimetableEntry({
        goalId: completedGoal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 0,
      });

      const state = createStoreState({
        goals: [completedGoal, incompleteGoal],
        timetableEntries: [timetableEntry],
      });

      const incompleteGoals = getIncompleteGoals(state, today);
      const completeGoals = getCompleteGoals(state, today);

      expect(incompleteGoals).toEqual([incompleteGoal]);
      expect(completeGoals).toEqual([completedGoal]);
    });
  });

  describe('convertGoalsToGoalRowProps', () => {
    it('converts Goal array to GoalRowProps array', () => {
      const durationInMinutes = 30;
      const goal = createGoal({ durationInMin: durationInMinutes }, [today]);

      const todaysEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 30,
      });
      const yesterdaysEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: moment(today).subtract(1, 'day').toDate(),
        startHour: 10,
        durationInMin: 30,
      });

      const state = createStoreState({
        goals: [goal],
        timetableEntries: [todaysEntry, yesterdaysEntry],
      });

      const expected: GoalRowProps[] = [
        {
          id: goal.id,
          title: goal.title,
          color: goal.color,
          totalMs: goal.durationInMs,
          completedMs: 30 * 60 * 1000,
          chainLength: 2,
          isActiveToday: true,
          isCompleted: undefined,
        },
      ];

      const result = convertGoalsToGoalRowProps(state, [goal], today);

      expect(result).toEqual(expected);
    });

    it('properly converts non-time-tracked goals', () => {
      const goal = createGoal({ durationInMin: undefined }, [today]);
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 0,
      });
      const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });

      const result = convertGoalsToGoalRowProps(state, [goal], today);
      const expected: GoalRowProps[] = [
        {
          id: goal.id,
          title: goal.title,
          color: goal.color,
          totalMs: undefined,
          completedMs: undefined,
          chainLength: 1,
          isCompleted: true,
          isActiveToday: true,
        },
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('isCompleted', () => {
    describe('when given a non-time-tracked goal', () => {
      let goal: Goal;

      beforeEach(() => {
        goal = createGoal({ durationInMin: undefined }, [today]);
      });

      it('returns true when goal is completed', () => {
        const timetableEntry = createTimetableEntry({
          goalId: goal.id,
          startDate: today,
          startHour: 10,
          durationInMin: 0,
        });

        const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });

        expect(isCompleted(state, goal, today)).toEqual(true);
      });

      it('returns false when goal is incomplete', () => {
        const state = createStoreState({ goals: [goal] });

        expect(isCompleted(state, goal, today)).toEqual(false);
      });
    });

    describe('when given a time-tracked goal', () => {
      let durationInMin: number;
      let goal: Goal;

      beforeEach(() => {
        durationInMin = 30;
        goal = createGoal({ durationInMin: durationInMin });
      });

      it('returns true when time-tracked goal is completed', () => {
        const timetableEntry = createTimetableEntry({
          goalId: goal.id,
          startDate: today,
          startHour: 10,
          durationInMin,
        });

        const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });

        expect(isCompleted(state, goal, today)).toEqual(true);
      });

      it('returns false when time-tracked goal is incomplete', () => {
        const state = createStoreState({ goals: [goal] });

        expect(isCompleted(state, goal, today)).toEqual(false);
      });
    });
  });

  describe('getProgress', () => {
    it('returns the current progress of a time-tracked goal', () => {
      const goal = createGoal({ durationInMin: 60 });
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 30,
      });

      const state = createStoreState({
        goals: [goal],
        timetableEntries: [timetableEntry],
      });

      const progress = getProgress(state, goal, today);

      expect(progress).toEqual(50);
    });

    it('returns `100` for a goal that is over its duration', () => {
      const goal = createGoal({ durationInMin: 60 });
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 100,
      });

      const state = createStoreState({
        goals: [goal],
        timetableEntries: [timetableEntry],
      });

      const progress = getProgress(state, goal, today);

      expect(progress).toEqual(100);
    });

    it('returns the current progress of a non-time-tracked goal', () => {
      const goal = createGoal({ durationInMin: undefined });
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 0,
      });

      const state = createStoreState({
        goals: [goal],
        timetableEntries: [timetableEntry],
      });

      const progress = getProgress(state, goal, today);

      expect(progress).toEqual(100);
    });
  });

  describe('getTotalProgressForDate', () => {
    it('returns the current progress off all goals in percentage for given date', () => {
      const goal1 = createGoal({ durationInMin: 60 }, [today]);
      const goal2 = createGoal({ durationInMin: undefined }, [today]);
      const goal3 = createGoal({ durationInMin: undefined }, [today]);

      const timetableEntry1 = createTimetableEntry({
        goalId: goal1.id,
        startDate: today,
        startHour: 10,
        durationInMin: 30,
      });
      const timetableEntry2 = createTimetableEntry({
        goalId: goal2.id,
        startDate: today,
        startHour: 10,
        durationInMin: 0,
      });

      const state = createStoreState({
        goals: [goal1, goal2, goal3],
        timetableEntries: [timetableEntry1, timetableEntry2],
      });

      const progress = getTotalProgressForDate(state, today);

      expect(progress).toEqual(50);
    });

    it('returns 100 when there are no goals for a given day', () => {
      const state = createStoreState({});

      const result = getTotalProgressForDate(state, today);

      expect(result).toEqual(100);
    });
  });

  describe('getCompletedMs', () => {
    it('returns the number of milliseconds that have been spent given goal and date', () => {
      const goal = createGoal({ durationInMin: 60 }, [today]);
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 30,
      });
      const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });

      const ms = getCompletedMs(state, goal, today);

      expect(ms).toEqual(30 * 60 * 1000);
    });

    it('returns `0` when there are no timetable entries for a goal', () => {
      const goal = createGoal({}, [today]);
      const state = createStoreState({ goals: [goal] });

      const ms = getCompletedMs(state, goal, today);

      expect(ms).toEqual(0);
    });

    it('returns `0` when given goal is not time-tracked', () => {
      const goal = createGoal({ durationInMin: undefined }, [today]);
      const state = createStoreState({ goals: [goal] });

      const ms = getCompletedMs(state, goal, today);

      expect(ms).toEqual(0);
    });
  });

  describe('getTotalCompletedMsForDate', () => {
    it('returns number of milliseconds spent on all goals on given date', () => {
      const goal1 = createGoal({ durationInMin: 30 }, [today]);
      const goal2 = createGoal({ durationInMin: 60 }, [today]);
      const timetableEntry1 = createTimetableEntry({
        goalId: goal1.id,
        startDate: today,
        startHour: 10,
        durationInMin: 15,
      });
      const timetableEntry2 = createTimetableEntry({
        goalId: goal2.id,
        startDate: today,
        startHour: 11,
        durationInMin: 30,
      });
      const state = createStoreState({ goals: [goal1, goal2], timetableEntries: [timetableEntry1, timetableEntry2] });

      const ms = getTotalCompletedMsForDate(state, today);

      expect(ms).toEqual((30 + 15) * 60 * 1000);
    });
  });

  describe('getRemainingMs', () => {
    const goal = createGoal({ durationInMin: 60 }, [today]);
    const timetableEntry1 = createTimetableEntry({
      goalId: goal.id,
      startDate: today,
      startHour: 10,
      durationInMin: 15,
    });

    it('returns the number of milliseconds remaining for a given goal', () => {
      const timetableEntry2 = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 11,
        durationInMin: 30,
      });
      const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry1, timetableEntry2] });

      const ms = getRemainingMs(state, goal, today);

      expect(ms).toEqual((60 - 30 - 15) * 60 * 1000);
    });

    it('returns a negative number when a goal is over its duration', () => {
      const timetableEntry2 = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 11,
        durationInMin: 60,
      });
      const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry1, timetableEntry2] });

      const ms = getRemainingMs(state, goal, today);

      expect(ms).toEqual((60 - 60 - 15) * 60 * 1000);
    });

    it('returns `0` when given goal is not time-tracked', () => {
      const goal = createGoal({ durationInMin: undefined }, [today]);
      const state = createStoreState({ goals: [goal] });

      const ms = getRemainingMs(state, goal, today);

      expect(ms).toEqual(0);
    });
  });

  describe('getTotalRemainingMsForDate', () => {
    it('returns the total number of milliseconds remaining for all goals on given day', () => {
      const goal1 = createGoal({ durationInMin: 30 }, [today]);
      const goal2 = createGoal({ durationInMin: 60 }, [today]);
      const timetableEntry = createTimetableEntry({
        goalId: goal1.id,
        startDate: today,
        startHour: 10,
        durationInMin: 15,
      });
      const state = createStoreState({ goals: [goal1, goal2], timetableEntries: [timetableEntry] });

      const ms = getTotalRemainingMsForDate(state, today);

      expect(ms).toEqual((15 + 60) * 60 * 1000);
    });

    it('returns `0` when completed milliseconds surpasses total milliseconds', () => {
      const goal = createGoal({ durationInMin: 30 }, [today]);
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 45,
      });
      const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });

      const ms = getTotalRemainingMsForDate(state, today);

      expect(ms).toEqual(0);
    });
  });

  describe('getTimetableEntriesForGoal', () => {
    let goal: Goal;

    beforeEach(() => {
      goal = createGoal({}, [today]);
    });

    it('returns an empty array when there are no entries for given date', () => {
      const state = createStoreState({ goals: [goal], timetableEntries: [] });

      const timetableEntriesForToday = getTimetableEntriesForGoal(state, goal, today);

      expect(timetableEntriesForToday).toEqual([]);
    });

    it('returns timetable entries for given date', () => {
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 0,
      });
      createTimetableEntry({ // Unrelated timetable entry.
        goalId: 'unrelated',
        startDate: today,
        startHour: 10,
        durationInMin: 0,
      });
      const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });

      const timetableEntriesForToday = getTimetableEntriesForGoal(state, goal, today);

      expect(timetableEntriesForToday).toEqual([timetableEntry]);
    });
  });

  describe('getChainLength', () => {
    let goal: Goal;
    const yesterday = moment(today).subtract(1, 'day').toDate();
    const dayBeforeYesterday = moment(today).subtract(2, 'day').toDate();

    beforeEach(() => {
      goal = createGoal({}, [today]);
    });

    it('returns the length given an unbroken chain', () => {
      const entryYesterday = createTimetableEntry({
        goalId: goal.id,
        startDate: yesterday,
        startHour: 10,
        durationInMin: 0,
      });

      const entryDayBefore = createTimetableEntry({
        goalId: goal.id,
        startDate: dayBeforeYesterday,
        startHour: 10,
        durationInMin: 0,
      });

      const state = createStoreState({ goals: [goal], timetableEntries: [entryYesterday, entryDayBefore] });

      const chainLength = getChainLength(state, goal, today);

      expect(chainLength).toEqual(2);
    });

    it('includes today in the chain as well if the goal is completed today', () => {
      const entryToday = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 0,
      });

      const state = createStoreState({ goals: [goal], timetableEntries: [entryToday] });

      const chainLength = getChainLength(state, goal, today);

      expect(chainLength).toEqual(1);
    });

    it('returns the length given a broken chain', () => {
      const entryYesterday = createTimetableEntry({
        goalId: 'some other goal',
        startDate: yesterday,
        startHour: 10,
        durationInMin: 0,
      });

      const entryDayBefore = createTimetableEntry({
        goalId: goal.id,
        startDate: dayBeforeYesterday,
        startHour: 10,
        durationInMin: 0,
      });

      const state = createStoreState({ goals: [goal], timetableEntries: [entryYesterday, entryDayBefore] });

      const chainLength = getChainLength(state, goal, today);

      expect(chainLength).toEqual(0);
    });
  });
});
