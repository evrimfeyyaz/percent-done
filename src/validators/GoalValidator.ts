import { Goal } from '../store/goals/types';
import { AbstractValidator } from './AbstractValidator';

export class GoalValidator extends AbstractValidator {
  goal: Partial<Goal>;
  allGoalTitles: string[];
  previousVersion?: Goal;

  /**
   *
   * @param goal
   * @param allGoalTitles
   * @param previousVersion If this is a goal that is being edited, supply
   * the previous (unedited) version of the goal.
   */
  constructor(goal: Partial<Goal>, allGoalTitles: string[], previousVersion?: Goal) {
    super();

    this.goal = goal;
    this.allGoalTitles = allGoalTitles;
    this.previousVersion = previousVersion;
  }

  validate(): boolean {
    if (this.goal.title == null || this.goal.title.trim() === '') {
      this.errors.push({
        property: 'title',
        message: 'You need to enter a title.',
      });
    }

    if (
      this.previousVersion?.title !== this.goal.title &&
      this.goal.title != null &&
      this.allGoalTitles.indexOf(this.goal.title) !== -1
    ) {
      this.errors.push({
        property: 'title',
        message: 'Another goal with this title already exists.',
      });
    }

    if (
      this.goal.recurringDays == null ||
      !Array.isArray(this.goal.recurringDays) ||
      this.goal.recurringDays.length === 0 ||
      this.goal.recurringDays.indexOf(true) === -1
    ) {
      this.errors.push({
        property: 'recurringDays',
        message: 'You should select at least one day.',
      });
    }

    return this.errors.length === 0;
  }
}
