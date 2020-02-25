import { createGoal } from '../../src/factories';
import { GoalValidator } from '../../src/validators';
import { Goal } from '../../src/store/goals/types';
import _ from 'lodash';

describe('GoalValidator', () => {
  let allGoalTitles: string[] = [];
  let goal: Partial<Goal>;

  beforeEach(() => {
    goal = createGoal({});
  });

  it('can be instantiated', () => {
    const validator = new GoalValidator(goal, allGoalTitles);

    expect(validator).toBeInstanceOf(Object);
  });

  describe('validate', () => {
    it('returns `true` when validates', () => {
      const validator = new GoalValidator(goal, allGoalTitles);

      const result = validator.validate();

      expect(result).toEqual(true);
    });

    it('returns `false` when validation fails', () => {
      delete goal.title;
      const validator = new GoalValidator(goal, allGoalTitles);

      const result = validator.validate();

      expect(result).toEqual(false);
    });

    describe('when a new goal is given', () => {
      it('validates title exists', () => {
        goal.title = undefined;

        const validator = new GoalValidator(goal, allGoalTitles);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'You need to enter a title.',
        });
      });

      it('validates title is not an empty or whitespace-only string', () => {
        goal.title = '     ';

        const validator = new GoalValidator(goal, allGoalTitles);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'You need to enter a title.',
        });
      });

      it('validates title is unique', () => {
        allGoalTitles = [goal.title as string];

        const validator = new GoalValidator(goal, allGoalTitles);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'Another goal with this title already exists.',
        });
      });

      it('validates at least one recurring day is selected', () => {
        goal.recurringDays = Array(7).fill(false);

        const validator = new GoalValidator(goal, allGoalTitles);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'recurringDays',
          message: 'You should select at least one day.',
        });
      });
    });

    describe('when a goal that is edited being validated', () => {
      let previousVersion: Goal;

      beforeEach(() => {
        previousVersion = createGoal({});
        goal = _.clone(previousVersion);
      });

      it('validates title exists', () => {
        goal.title = undefined;

        const validator = new GoalValidator(goal, allGoalTitles, previousVersion);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'You need to enter a title.',
        });
      });

      it('validates title is not an empty or whitespace-only string', () => {
        goal.title = '     ';

        const validator = new GoalValidator(goal, allGoalTitles, previousVersion);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'You need to enter a title.',
        });
      });

      it('validates title is unique when the title is different than the unedited title', () => {
        goal.title = 'Some New Title';
        allGoalTitles = [goal.title as string];

        const validator = new GoalValidator(goal, allGoalTitles, previousVersion);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'Another goal with this title already exists.',
        });
      });

      it('does not validate title is unique when the title is the same as the unedited title', () => {
        allGoalTitles = [goal.title as string];

        const validator = new GoalValidator(goal, allGoalTitles, previousVersion);
        validator.validate();

        expect(validator.errors).not.toContainEqual({
          property: 'title',
          message: 'Another goal with this title already exists.',
        });
      });

      it('validates at least one recurring day is selected', () => {
        goal.recurringDays = [];

        const validator = new GoalValidator(goal, allGoalTitles, previousVersion);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'recurringDays',
          message: 'You should select at least one day.',
        });
      });
    });
  });
});
