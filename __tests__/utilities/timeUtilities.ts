import {
  compareDateIndices,
  convertDateToIndex,
  convertSecondsToHoursAndMinutes, formatDurationInMs, msToHoursMinutesSeconds,
} from '../../src/utilities';

describe('time utilities', () => {
  describe('convertDateToIndex', () => {
    it('converts given date to index', () => {
      const date = new Date(2019, 4, 31); // May 31, 2019
      console.log(date.getTimezoneOffset());

      const index = convertDateToIndex(date);
      const expectedIndex = '2019-5-31';

      expect(index).toEqual(expectedIndex);
    });
  });

  describe('compareDateIndices', () => {
    it('compares two date indices', () => {
      const dateIdx1 = '2018-5-31';
      const dateIdx2 = '2019-5-31';

      expect(compareDateIndices(dateIdx1, dateIdx2)).toBeLessThan(0);
      expect(compareDateIndices(dateIdx1, dateIdx1)).toEqual(0);
      expect(compareDateIndices(dateIdx2, dateIdx1)).toBeGreaterThan(0);
    });
  });

  describe('convertSecondsToHoursAndMinutes', () => {
    it('converts seconds to hours and minutes', () => {
      const seconds = 3600; // 1 hour.

      const { hours, minutes } = convertSecondsToHoursAndMinutes(seconds);

      expect(hours).toEqual(1);
      expect(minutes).toEqual(0);
    });
  });

  describe('msToHoursMinutesSeconds', () => {
    it('dissects given amount in ms into hours, minutes and seconds', () => {
      const fiveSecondsInMs = 5 * 1000;
      const fiveMinutesInMs = 5 * 60 * 1000;
      const fiveHoursInMs = 5 * 60 * 60 * 1000;

      const ms = fiveHoursInMs + fiveMinutesInMs + fiveSecondsInMs;

      expect(msToHoursMinutesSeconds(ms)).toEqual({
        hours: 5,
        minutes: 5,
        seconds: 5,
      });
    });
  });

  describe('formatDurationInMs', () => {
    const fiveSecondsInMs = 5 * 1000;
    const fiveMinutesInMs = 5 * 60 * 1000;
    const fiveHoursInMs = 5 * 60 * 60 * 1000;

    it('returns hours and minutes when time is more than one hour', () => {
      const time = fiveHoursInMs + fiveMinutesInMs + fiveSecondsInMs;

      expect(formatDurationInMs(time)).toEqual('05h 05m');
    });

    it('returns minutes and seconds when time is less than one hour', () => {
      const time = fiveMinutesInMs + fiveSecondsInMs;

      expect(formatDurationInMs(time)).toEqual('05m 05s');
    });
  });
});
