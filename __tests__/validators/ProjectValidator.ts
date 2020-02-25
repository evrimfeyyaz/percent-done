import { Project } from '../../src/store/projects/types';
import { createProject } from '../../src/factories';
import { ProjectValidator } from '../../src/validators';
import _ from 'lodash';

describe('ProjectValidator', () => {
  let allProjectTitles: string[] = [];
  let project: Partial<Project>;
  const projectTitle = 'Project Title';

  beforeEach(() => {
    project = createProject(projectTitle);
  });

  it('can be instantiated', () => {
    const validator = new ProjectValidator(project, allProjectTitles);

    expect(validator).toBeInstanceOf(Object);
  });

  describe('validate', () => {
    it('returns `true` when validates', () => {
      const validator = new ProjectValidator(project, allProjectTitles);

      const result = validator.validate();

      expect(result).toEqual(true);
    });

    it('returns `false` when validation fails', () => {
      delete project.title;
      const validator = new ProjectValidator(project, allProjectTitles);

      const result = validator.validate();

      expect(result).toEqual(false);
    });

    describe('when a new project is given', () => {
      it('validates title exists', () => {
        project.title = undefined;

        const validator = new ProjectValidator(project, allProjectTitles);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'You need to enter a title.',
        });
      });

      it('validates title is not an empty or whitespace-only string', () => {
        project.title = '     ';

        const validator = new ProjectValidator(project, allProjectTitles);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'You need to enter a title.',
        });
      });

      it('validates title is case-insensitively unique', () => {
        allProjectTitles = [(project.title as string).toUpperCase()];

        const validator = new ProjectValidator(project, allProjectTitles);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'Another project with this title already exists.',
        });
      });
    });

    describe('when a project that is edited being validated', () => {
      let previousVersion: Project;

      beforeEach(() => {
        previousVersion = createProject(projectTitle);
        project = _.clone(previousVersion);
      });

      it('validates title exists', () => {
        project.title = undefined;

        const validator = new ProjectValidator(project, allProjectTitles, previousVersion);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'You need to enter a title.',
        });
      });

      it('validates title is not an empty or whitespace-only string', () => {
        project.title = '     ';

        const validator = new ProjectValidator(project, allProjectTitles, previousVersion);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'You need to enter a title.',
        });
      });

      it('validates title is unique when the title is different than the unedited title', () => {
        project.title = 'Some New Title';
        allProjectTitles = [project.title as string];

        const validator = new ProjectValidator(project, allProjectTitles, previousVersion);
        validator.validate();

        expect(validator.errors).toContainEqual({
          property: 'title',
          message: 'Another project with this title already exists.',
        });
      });

      it('does not validate title is unique when the title is the same as the unedited title', () => {
        allProjectTitles = [project.title as string];

        const validator = new ProjectValidator(project, allProjectTitles, previousVersion);
        validator.validate();

        expect(validator.errors).not.toContainEqual({
          property: 'title',
          message: 'Another project with this title already exists.',
        });
      });
    });
  });
});
