import { createGoal } from '../../../src/factories';
import { isTimeTracked } from '../../../src/store/goals/utilities';

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
});
