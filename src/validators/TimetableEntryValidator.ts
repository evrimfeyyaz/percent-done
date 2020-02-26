import { AbstractValidator } from './AbstractValidator';
import { TimetableEntry } from '../store/timetableEntries/types';

export class TimetableEntryValidator extends AbstractValidator {
  timetableEntry: Partial<TimetableEntry>;

  constructor(timetableEntry: Partial<TimetableEntry>) {
    super();

    this.timetableEntry = timetableEntry;
  }

  validate(): boolean {
    const { startTimestamp, endTimestamp } = this.timetableEntry;

    if (startTimestamp == null) {
      this.errors.push({
        property: 'startTimestamp',
        message: 'You should enter the starting time.',
      });
    }

    if (endTimestamp == null) {
      this.errors.push({
        property: 'endTimestamp',
        message: 'You should enter the ending time.',
      });
    }

    if ((startTimestamp as number) > (endTimestamp as number)) {
      this.errors.push({
        property: 'endTimestamp',
        message: 'Time travel is cheating.',
      });
    }

    return this.errors.length === 0;
  }
}
