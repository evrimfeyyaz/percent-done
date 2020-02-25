import { AbstractValidator } from './AbstractValidator';
import { Project } from '../store/projects/types';

export class ProjectValidator extends AbstractValidator {
  project: Partial<Project>;
  allProjectTitles: string[];
  previousVersion?: Project;

  constructor(project: Partial<Project>, allProjectTitles: string[], previousVersion?: Project) {
    super();

    this.project = project;
    this.allProjectTitles = allProjectTitles;
    this.previousVersion = previousVersion;
  }

  validate(): boolean {
    if (this.project.title == null || this.project.title.trim() === '') {
      this.errors.push({
        property: 'title',
        message: 'You need to enter a title.',
      });
    }

    if (
      this.previousVersion?.title !== this.project.title &&
      this.project.title != null &&
      this.allProjectTitles.some(title => title.toLowerCase() === this.project.title?.toLowerCase())
    ) {
      this.errors.push({
        property: 'title',
        message: 'Another project with this title already exists.',
      });
    }

    return this.errors.length === 0;
  }
}
