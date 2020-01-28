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
  getTotalCompletedMsForDate, getTotalCompletedMsForLast30Days, getTotalCompletedMsForLast7Days,
  getTotalProgressForDate, getTotalProgressForLast30Days, getTotalProgressForLast7Days,
  getTotalRemainingMsForDate,
  isCompleted, isScheduled, isThereEnoughDataToShowStatisticsOfLastNDays,
} from '../../../src/store/goals/selectors';
import { GoalRowProps } from '../../../src/components';
import { Goal } from '../../../src/store/goals/types';
import { goalColors } from '../../../src/theme';
import { getAbbreviatedDate, momentWithDeviceLocale } from '../../../src/utilities';
import { StoreState } from '../../../src/store/types';
import { TimetableEntry } from '../../../src/store/timetableEntries/types';

describe('goals selectors', () => {
  const today = new Date();
  const tomorrow = momentWithDeviceLocale(today).add(1, 'day').toDate();
  const yesterday = momentWithDeviceLocale(today).subtract(1, 'day').toDate();
  const twoDaysAgo = momentWithDeviceLocale(today).subtract(2, 'day').toDate();
  const threeDaysAgo = momentWithDeviceLocale(today).subtract(3, 'days').toDate();
  const fourDaysAgo = momentWithDeviceLocale(today).subtract(4, 'days').toDate();
  const fiveDaysAgo = momentWithDeviceLocale(today).subtract(5, 'days').toDate();

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
    let goal: Goal;

    beforeEach(() => {
      goal = createGoal({}, undefined, true);
    });

    it('returns all goals that should be completed for given date', () => {
      const goalForTomorrow = createGoal({}, [tomorrow]);

      const state = createStoreState({ goals: [goal, goalForTomorrow] });

      const result = getGoalsForDate(state, today);

      expect(result).toContain(goal);
      expect(result).not.toContain(goalForTomorrow);
    });

    it('does not return deleted goals if they were deleted before given date', () => {
      goal.deletedAtTimestamp = yesterday.getTime();
      const state = createStoreState({ goals: [goal] });

      const result = getGoalsForDate(state, today);

      expect(result).toEqual([]);
    });

    it('returns deleted goals if they were deleted after given date', () => {
      goal.deletedAtTimestamp = +tomorrow;
      const state = createStoreState({ goals: [goal] });

      const result = getGoalsForDate(state, today);

      expect(result).toEqual([goal]);
    });

    it('does not return a deleted goal if it was deleted on the given date', () => {
      goal.deletedAtTimestamp = +today;
      const state = createStoreState({ goals: [goal] });

      const result = getGoalsForDate(state, today);

      expect(result).toEqual([]);
    });

    it('does not return a goal if it was not yet created on the given day', () => {
      goal.createdAtTimestamp = +tomorrow;
      const state = createStoreState({ goals: [goal] });

      const result = getGoalsForDate(state, today);

      expect(result).toEqual([]);
    });

    it('does return a goal if it has already been created on the given day', () => {
      goal.createdAtTimestamp = +tomorrow;
      const state = createStoreState({ goals: [goal] });

      const result = getGoalsForDate(state, today);

      expect(result).toEqual([]);
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
        startDate: yesterday,
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
          color: goalColors[goal.colorIndex],
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
          color: goalColors[goal.colorIndex],
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

    it('returns `null`` when there are no goals for a given day', () => {
      const state = createStoreState({});

      const result = getTotalProgressForDate(state, today);

      expect(result).toBeNull();
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

    it('returns `null` when there are no goals on the given date', () => {
      const state = createStoreState({});

      const result = getTotalCompletedMsForDate(state, today);

      expect(result).toBeNull();
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

    it('returns `null` when given goal is not time-tracked', () => {
      const goal = createGoal({ durationInMin: undefined }, [today]);
      const state = createStoreState({ goals: [goal] });

      const ms = getRemainingMs(state, goal, today);

      expect(ms).toBeNull();
    });

    it('returns `null` when given goal is not scheduled for the given day', () => {
      const goal = createGoal({ durationInMin: 60 }, [yesterday]);
      const state = createStoreState({ goals: [goal] });

      const ms = getRemainingMs(state, goal, today);

      expect(ms).toBeNull();
    });
  });

  describe('isScheduled', () => {
    let state: StoreState, goal: Goal;

    beforeAll(() => {
      goal = createGoal({}, [today]);
      state = createStoreState({ goals: [goal] });
    });

    it('returns `true` if given goal is scheduled for given date', () => {
      const result = isScheduled(state, goal.id, today);

      expect(result).toEqual(true);
    });

    it('returns `false` if given goal is not scheduled for given date', () => {
      const result = isScheduled(state, goal.id, yesterday);

      expect(result).toEqual(false);
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
        startDate: twoDaysAgo,
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
        startDate: twoDaysAgo,
        startHour: 10,
        durationInMin: 0,
      });

      const state = createStoreState({ goals: [goal], timetableEntries: [entryYesterday, entryDayBefore] });

      const chainLength = getChainLength(state, goal, today);

      expect(chainLength).toEqual(0);
    });
  });

  describe('Statistics', () => {
    const goalDurationInMin = 60;
    const lastWeeksEntryDurationInMin = goalDurationInMin * .5;
    const yesterdaysEntryDurationInMin = goalDurationInMin * .25;
    let lastWeeksEntry: TimetableEntry, yesterdaysEntry: TimetableEntry;
    let store: StoreState;

    beforeAll(() => {
      const oneWeekAgo = momentWithDeviceLocale(today).subtract(7, 'days').toDate();

      const goal = createGoal({ durationInMin: goalDurationInMin }, undefined, true);
      lastWeeksEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: oneWeekAgo,
        startHour: 10,
        startMinute: 0,
        durationInMin: lastWeeksEntryDurationInMin,
      });
      yesterdaysEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: yesterday,
        startHour: 10,
        startMinute: 0,
        durationInMin: yesterdaysEntryDurationInMin,
      });
      store = createStoreState({ goals: [goal], timetableEntries: [lastWeeksEntry, yesterdaysEntry] });

      store.goals.byId[goal.id].createdAtTimestamp = oneWeekAgo.getTime();
    });

    describe('getTotalProgressForLast7Days', () => {
      it('returns the progress for the last seven days starting from yesterday in `{ "Thu", 50 }` format', () => {
        const result = getTotalProgressForLast7Days(store);

        expect(result.map(datum => datum.label).sort()).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].sort());
        expect(result[0].value).toEqual(lastWeeksEntryDurationInMin / goalDurationInMin * 100);
        expect(result[1].value).toEqual(0);
        expect(result[6].value).toEqual(yesterdaysEntryDurationInMin / goalDurationInMin * 100);
      });
    });

    describe('getTotalCompletedMsForLast7Days', () => {
      it('returns the total completed time in ms for the last seven days starting from yesterday in `{ "Thu", 1000 }` format', () => {
        const result = getTotalCompletedMsForLast7Days(store);

        expect(result.map(datum => datum.label).sort()).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].sort());
        expect(result[0].value).toEqual(lastWeeksEntryDurationInMin * 60 * 1000);
        expect(result[1].value).toEqual(0);
        expect(result[6].value).toEqual(yesterdaysEntryDurationInMin * 60 * 1000);
      });
    });

    describe('getTotalProgressForLast30Days', () => {
      it('returns the progress for the last 30 days starting from yesterday in `{ "May 31", 50 }` format', () => {
        const result = getTotalProgressForLast30Days(store);

        const yesterdaysLabel = getAbbreviatedDate(yesterday);

        expect(result[29].label).toEqual(yesterdaysLabel);
        expect(result[23].value).toEqual(lastWeeksEntryDurationInMin / goalDurationInMin * 100);
        expect(result[24].value).toEqual(0);
        expect(result[29].value).toEqual(yesterdaysEntryDurationInMin / goalDurationInMin * 100);
      });
    });

    describe('getTotalCompletedMsForLast30Days', () => {
      it('returns the total completed time in ms for the last 30 days starting from yesterday in `{ "May 31", 1000 }` format', () => {
        const result = getTotalCompletedMsForLast30Days(store);

        const yesterdaysLabel = getAbbreviatedDate(yesterday);

        expect(result[29].label).toEqual(yesterdaysLabel);
        expect(result[23].value).toEqual(lastWeeksEntryDurationInMin * 60 * 1000);
        expect(result[24].value).toEqual(0);
        expect(result[29].value).toEqual(yesterdaysEntryDurationInMin * 60 * 1000);
      });
    });
  });

  describe('isThereEnoughDataToShowStatisticsOfLastNDays', () => {
    let goal: Goal;

    beforeEach(() => {
      goal = createGoal({}, undefined, true);
      goal.createdAtTimestamp = fiveDaysAgo.getTime();
      goal.deletedAtTimestamp = threeDaysAgo.getTime();
    });

    describe('returns `false` when', () => {
      it('there are no goals for five or more days in the last seven days', () => {
        const state = createStoreState({ goals: [goal] });

        const result = isThereEnoughDataToShowStatisticsOfLastNDays(state, 7, 2);

        expect(result).toEqual(false);
      });

      it('there are goals but no timetable entries for five or more days in the last seven days', () => {
        const goal2 = createGoal({}, undefined, true);
        const tenDaysAgo = momentWithDeviceLocale(today).subtract(10, 'days').toDate();
        goal2.createdAtTimestamp = tenDaysAgo.getTime();

        const entry1 = createTimetableEntry({
          goalId: goal.id,
          startDate: fiveDaysAgo,
          startHour: 10,
          durationInMin: 10,
        });
        const entry2 = createTimetableEntry({
          goalId: goal.id,
          startDate: fourDaysAgo,
          startHour: 10,
          durationInMin: 10,
        });

        const state = createStoreState({ goals: [goal, goal2], timetableEntries: [entry1, entry2] });

        const result = isThereEnoughDataToShowStatisticsOfLastNDays(state, 7, 2);

        expect(result).toEqual(false);
      });
    });

    it('returns `true` when there are goals and timetable entries for at least three days in the last seven days', () => {
      const goal = createGoal({}, undefined, true);
      goal.createdAtTimestamp = fiveDaysAgo.getTime();
      goal.deletedAtTimestamp = twoDaysAgo.getTime();

      const entry1 = createTimetableEntry({
        goalId: goal.id,
        startDate: fiveDaysAgo,
        startHour: 10,
        durationInMin: 10,
      });
      const entry2 = createTimetableEntry({
        goalId: goal.id,
        startDate: fourDaysAgo,
        startHour: 10,
        durationInMin: 10,
      });
      const entry3 = createTimetableEntry({
        goalId: goal.id,
        startDate: threeDaysAgo,
        startHour: 10,
        durationInMin: 10,
      });

      const state = createStoreState({ goals: [goal], timetableEntries: [entry1, entry2, entry3] });

      const result = isThereEnoughDataToShowStatisticsOfLastNDays(state, 7, 2);

      expect(result).toEqual(true);
    });
  });
});
