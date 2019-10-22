import { createGoal, createStoreState } from '../../../src/factories';
import { isActiveToday, isDeleted, isTimeTracked } from '../../../src/store/goals/utilities';
import moment from 'moment';
import { Goal } from '../../../src/store/goals/types';

describe('goal utilities', () => {
  const today = new Date();

  describe('isTimeTracked', () => {
    it('returns `true` when goal duration is a number greater than zero', () => {
      const goal = createGoal({ durationInMin: 1 });

      expect(isTimeTracked(goal)).toEqual(true);
    });

    it('returns `false` when goal duration is not a number', () => {
      const goal = createGoal({ durationInMin: undefined });

      expect(isTimeTracked(goal)).toEqual(false);
    });

    it('returns `false` when goal duration is `0`', () => {
      const goal = createGoal({ durationInMin: 0 });

      expect(isTimeTracked(goal)).toEqual(false);
    });
  });

  describe('isActiveToday', () => {
    it('returns `true` when the recurring days of the goal include today', () => {
      const goal = createGoal({}, [today]);

      const result = isActiveToday(goal);

      expect(result).toEqual(true);
    });

    it('returns `false` when the recurring days of the goal does not include today', () => {
      const tomorrow = moment(today).add(1, 'day').toDate();
      const goal = createGoal({}, [tomorrow]);

      const result = isActiveToday(goal);

      expect(result).toEqual(false);
    });
  });

  describe('isDeleted', () => {
    let goal: Goal;

    beforeEach(() => {
      goal = createGoal({});
    });

    it('returns `true` when given goal was deleted before given date', () => {
      goal.deletedAt = moment(today).subtract(1, 'day').toDate();

      const result = isDeleted(goal, today);

      expect(result).toEqual(true);
    });

    it('returns `true` when given goal was deleted on the same date, even if it is deleted later than given time', () => {
      goal.deletedAt = moment(today).add(1, 'hour').toDate();

      const result = isDeleted(goal, today);

      expect(result).toEqual(true);
    });

    it('returns `false` when given goal was deleted after given date', () => {
      goal.deletedAt = moment(today).add(1, 'day').toDate();

      const result = isDeleted(goal, today);

      expect(result).toEqual(false);
    });

    it('returns `false` when given goal is not deleted', () => {
      goal.deletedAt = undefined;

      const result = isDeleted(goal, today);

      expect(result).toEqual(false);
    });
  });
});
