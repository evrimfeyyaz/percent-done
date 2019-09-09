import { createGoal, createStoreState, createTimetableEntry } from '../../../src/factories';
import {
  convertGoalsToGoalListProps,
  getCompleteGoals,
  getGoals,
  getIncompleteGoals, isCompleted,
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
});
