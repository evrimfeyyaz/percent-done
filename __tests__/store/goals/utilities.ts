import { createGoal, createStoreState } from '../../../src/factories';
import { isActiveToday, isTimeTracked } from '../../../src/store/goals/utilities';
import moment from 'moment';

describe('goal utilities', () => {
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
    const today = new Date();

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
});
