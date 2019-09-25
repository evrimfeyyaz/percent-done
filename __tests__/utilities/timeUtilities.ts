import {
  compareDateIndices,
  convertDateToIndex,
  convertSecondsToHoursAndMinutes, msToHoursMinutes, msToHoursMinutesSeconds,
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
    it('converts given ms to HH:MM:SS', () => {
      const fiveSecondsInMs = 5 * 1000;
      const fiveMinutesInMs = 5 * 60 * 1000;
      const fiveHoursInMs = 5 * 60 * 60 * 1000;

      const fiveSeconds = msToHoursMinutesSeconds(fiveSecondsInMs);
      const fiveMinutes = msToHoursMinutesSeconds(fiveMinutesInMs);
      const fiveHours = msToHoursMinutesSeconds(fiveHoursInMs);

      expect(fiveSeconds).toEqual('00:00:05');
      expect(fiveMinutes).toEqual('00:05:00');
      expect(fiveHours).toEqual('05:00:00');
    });
  });

  describe('msToHoursMinutes', () => {
    it('converts given ms to HH:MM', () => {
      const fiveMinutesInMs = 5 * 60 * 1000;
      const fiveHoursInMs = 5 * 60 * 60 * 1000;

      const fiveMinutes = msToHoursMinutes(fiveMinutesInMs);
      const fiveHours = msToHoursMinutes(fiveHoursInMs);

      expect(fiveMinutes).toEqual('00:05');
      expect(fiveHours).toEqual('05:00');
    });
  });
});
