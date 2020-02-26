import { TimetableEntry } from '../../src/store/timetableEntries/types';
import { createTimetableEntry } from '../../src/factories';
import { TimetableEntryValidator } from '../../src/validators';

describe('TimetableEntryValidator', () => {
  let timetableEntry: Partial<TimetableEntry>;

  beforeEach(() => {
    timetableEntry = createTimetableEntry({ startDate: new Date(), startHour: 10, durationInMin: 30 });
  });

  it('can be instantiated', () => {
    const validator = new TimetableEntryValidator(timetableEntry);

    expect(validator).toBeInstanceOf(Object);
  });

  describe('validate', () => {
    it('returns `true` when validates', () => {
      const validator = new TimetableEntryValidator(timetableEntry);

      const result = validator.validate();

      expect(result).toEqual(true);
    });

    it('returns `false` when validation fails', () => {
      timetableEntry.endTimestamp = (timetableEntry.startTimestamp as number) - 1;
      const validator = new TimetableEntryValidator(timetableEntry);

      const result = validator.validate();

      expect(result).toEqual(false);
    });
  });

  describe('errors', () => {
    it('has an error when start time is after end time', () => {
      timetableEntry.endTimestamp = (timetableEntry.startTimestamp as number) - 1;

      const validator = new TimetableEntryValidator(timetableEntry);
      validator.validate();

      expect(validator.errors).toContainEqual({
        property: 'endTimestamp',
        message: 'Time travel is cheating.',
      });
    });

    it('does not have an error when start time is equal to end time', () => {
      timetableEntry.endTimestamp = timetableEntry.startTimestamp as number;

      const validator = new TimetableEntryValidator(timetableEntry);
      validator.validate();

      expect(validator.errors).not.toContainEqual({
        property: 'endTimestamp',
        message: 'Time travel is cheating.',
      });
    });

    it('does not have an error when start time is before end time', () => {
      timetableEntry.endTimestamp = timetableEntry.startTimestamp as number;

      const validator = new TimetableEntryValidator(timetableEntry);
      validator.validate();

      expect(validator.errors).not.toContainEqual({
        property: 'endTimestamp',
        message: 'Time travel is cheating.',
      });
    });

    it('has an error when start time is `null` or `undefined`', () => {
      delete timetableEntry.startTimestamp;

      const validator = new TimetableEntryValidator(timetableEntry);
      validator.validate();

      expect(validator.errors).toContainEqual({
        property: 'startTimestamp',
        message: 'You should enter the starting time.',
      });
    });

    it('has an error when end time is `null` or `undefined`', () => {
      delete timetableEntry.endTimestamp;

      const validator = new TimetableEntryValidator(timetableEntry);
      validator.validate();

      expect(validator.errors).toContainEqual({
        property: 'endTimestamp',
        message: 'You should enter the ending time.',
      });
    });
  })
});
