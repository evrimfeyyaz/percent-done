import { createGoal, createStoreState, createTimetableEntry } from '../../../src/factories';
import {
  convertGoalsToGoalListProps,
  getCompletedSeconds,
  getCompleteGoals,
  getGoals,
  getIncompleteGoals,
  getProgress,
  getRemainingSecondsForDate,
  getTotalCompletedSecondsForDate,
  getTotalProgressForDate,
  isCompleted,
} from '../../../src/store/goals/selectors';
import { GoalListProps } from '../../../src/components';
import moment from 'moment';
import { Goal } from '../../../src/store/goals/types';

describe('goals selectors', () => {
  const today = new Date();

  describe('getGoals', () => {
    it('returns all goals that should be completed for given date', () => {
      const tomorrow = moment(today).add(1, 'day').toDate();

      const goalForToday = createGoal({}, [today]);
      const goalForTomorrow = createGoal({}, [tomorrow]);
      const state = createStoreState({ goals: [goalForToday, goalForTomorrow] });

      const goalsForToday = getGoals(state, today);

      expect(goalsForToday).toContain(goalForToday);
      expect(goalsForToday).not.toContain(goalForTomorrow);
    });
  });

  describe('getIncompleteGoals and getCompleteGoals', () => {
    it('returns only incomplete or complete goals', () => {
      const completedGoal = createGoal({ isTimeTracked: false }, [today]);
      const incompleteGoal = createGoal({ isTimeTracked: true }, [today]);

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

  describe('convertGoalsToGoalListProps', () => {
    it('converts Goal array to GoalListProps array', () => {
      const durationInMinutes = 30;
      const chainLength = 2;
      const goal = createGoal({ durationInSeconds: durationInMinutes * 60, chainLength });

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

      const expected: GoalListProps = {
        goals: [
          {
            key: goal.id,
            title: goal.title,
            color: goal.color,
            totalSeconds: goal.durationInSeconds,
            completedSeconds: 30 * 60,
            chainLength: chainLength,
          },
        ],
      };

      const result = convertGoalsToGoalListProps(state, [goal], today);

      expect(result).toEqual(expected);
    });

    it('properly converts non-time-tracked goals', () => {
      const goal = createGoal({ isTimeTracked: false });
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 0,
      });
      const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });

      const result = convertGoalsToGoalListProps(state, [goal], today);
      const expected: GoalListProps = {
        goals: [
          {
            key: goal.id,
            title: goal.title,
            color: goal.color,
            totalSeconds: undefined,
            completedSeconds: undefined,
            chainLength: 0,
            isCompleted: true,
          },
        ],
      };

      expect(result).toEqual(expected);
    });
  });

  describe('isCompleted', () => {
    describe('when given a non-time-tracked goal', () => {
      let goal: Goal;

      beforeEach(() => {
        goal = createGoal({ isTimeTracked: false });
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
        goal = createGoal({ isTimeTracked: true, durationInSeconds: durationInMin * 60 });
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
      const goal = createGoal({ isTimeTracked: true, durationInSeconds: 60 * 60 });
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

    it('returns the current progress of a time-tracked goal', () => {
      const goal = createGoal({ isTimeTracked: false });
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
      const goal1 = createGoal({ isTimeTracked: true, durationInSeconds: 60 * 60 }, [today]);
      const goal2 = createGoal({ isTimeTracked: false }, [today]);
      const goal3 = createGoal({ isTimeTracked: false }, [today]);

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
  });

  describe('getCompletedSeconds', () => {
    it('returns the number of seconds that have been spent given goal and date', () => {
      const goal = createGoal({ isTimeTracked: true, durationInSeconds: 60 * 60 }, [today]);
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 30,
      });
      const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });

      const seconds = getCompletedSeconds(state, goal, today);

      expect(seconds).toEqual(30 * 60);
    });

    it('returns `0` when there are no timetable entries for a goal', () => {
      const goal = createGoal({}, [today]);
      const state = createStoreState({ goals: [goal] });

      const seconds = getCompletedSeconds(state, goal, today);

      expect(seconds).toEqual(0);
    });

    it('returns `0` when given goal is not time-tracked', () => {
      const goal = createGoal({ isTimeTracked: false }, [today]);
      const state = createStoreState({ goals: [goal] });

      const seconds = getCompletedSeconds(state, goal, today);

      expect(seconds).toEqual(0);
    });
  });

  describe('getTotalCompletedSecondsForDate', () => {
    it('returns number of seconds spent on all goals on given date', () => {
      const goal1 = createGoal({ isTimeTracked: true, durationInSeconds: 30 * 60 }, [today]);
      const goal2 = createGoal({ isTimeTracked: true, durationInSeconds: 60 * 60 }, [today]);
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

      const seconds = getTotalCompletedSecondsForDate(state, today);

      expect(seconds).toEqual((30 + 15) * 60);
    });
  });

  describe('getRemainingSecondsForDate', () => {
    it('returns the total number of seconds remaining for all goals on given day', () => {
      const goal1 = createGoal({ isTimeTracked: true, durationInSeconds: 30 * 60 }, [today]);
      const goal2 = createGoal({ isTimeTracked: true, durationInSeconds: 60 * 60 }, [today]);
      const timetableEntry = createTimetableEntry({
        goalId: goal1.id,
        startDate: today,
        startHour: 10,
        durationInMin: 15,
      });
      const state = createStoreState({ goals: [goal1, goal2], timetableEntries: [timetableEntry] });

      const seconds = getRemainingSecondsForDate(state, today);

      expect(seconds).toEqual((15 + 60) * 60);
    });

    it('returns `0` when completed seconds surpasses total seconds', () => {
      const goal = createGoal({ isTimeTracked: true, durationInSeconds: 30 * 60 }, [today]);
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        startDate: today,
        startHour: 10,
        durationInMin: 45,
      });
      const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });

      const seconds = getRemainingSecondsForDate(state, today);

      expect(seconds).toEqual(0);
    });
  });
});
