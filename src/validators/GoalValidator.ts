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
      this.previousVersion?.title.toLowerCase() !== this.goal.title?.toLowerCase() &&
      this.goal.title != null &&
      this.allGoalTitles.some(title => title.toLowerCase() === this.goal.title?.toLowerCase())
    ) {
      this.errors.push({
        property: 'title',
        message: 'Another goal with this title already exists.',
      });
    }

    return this.errors.length === 0;
  }
}
