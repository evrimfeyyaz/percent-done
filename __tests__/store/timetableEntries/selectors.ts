import { createGoal, createStoreState, createTimetableEntry } from '../../../src/factories';
import { TimetableRow } from '../../../src/components';
import {
  convertTimetableEntriesToTimetableRows,
  getTimetableEntries, getTimetableEntryById,
} from '../../../src/store/timetableEntries/selectors';

describe('timetable entries selectors', () => {
  const today = new Date();

  describe('getTimetableEntryById', () => {
    it('returns the given timetable entry when it exists', () => {
      const timetableEntry = createTimetableEntry({
        startDate: today,
        startHour: 10,
        durationInMin: 30,
      });

      const state = createStoreState({
        timetableEntries: [timetableEntry],
      });

      const result = getTimetableEntryById(state, timetableEntry.id);

      expect(result).toEqual(timetableEntry);
    });

    it('returns null when no entry exists for the given ID', () => {
      const state = createStoreState({});

      const result = getTimetableEntryById(state, 'wrong-id');

      expect(result).toEqual(null);
    });
  });

  describe('getTimetableEntries', () => {
    it('returns the timetable entries for a given date', () => {
      const timetableEntry1 = createTimetableEntry({
        startDate: today,
        startHour: 10,
        durationInMin: 30,
      });

      const timetableEntry2 = createTimetableEntry({
        startDate: today,
        startHour: 11,
        durationInMin: 30,
      });

      const state = createStoreState({
        timetableEntries: [timetableEntry1, timetableEntry2],
      });

      const result = getTimetableEntries(state, today);

      expect(result).toEqual([timetableEntry1, timetableEntry2]);
    });

    it('returns an empty array when there are no entries for the given day', () => {
      const state = createStoreState({});

      const result = getTimetableEntries(state, today);

      expect(result).toEqual([]);
    });
  });

  describe('convertTimetableEntriesToTimetableRows', () => {
    it('converts timetable entries to timetable rows', () => {
      const goal = createGoal({ durationInMin: 30 });

      const startHour = 10;
      const startMinute = 0;
      const durationInMin = 10;
      const timetableEntry = createTimetableEntry({
        goalId: goal.id,
        durationInMin,
        startDate: today,
        startHour,
        startMinute,
      });

      const state = createStoreState({
        goals: [goal],
        timetableEntries: [timetableEntry],
      });

      const expected: TimetableRow[] = [{
        title: goal.title,
        timeTracked: true,
        startHour: startHour,
        startMinute: startMinute,
        endHour: 10,
        endMinute: durationInMin,
        color: goal.color,
        id: timetableEntry.id,
      }];

      const result = convertTimetableEntriesToTimetableRows(state, [timetableEntry]);

      expect(result).toEqual(expected);
    });
  });
});
