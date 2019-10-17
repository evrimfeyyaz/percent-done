import {
  compareDateIndices,
  convertDateToIndex,
  deconstructFormattedDuration, formatDurationInMs, msToHoursMinutesSeconds,
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

    describe('when roundLastValueUp is true', () => {
      it('rounds up the last value', () => {
        const time1 = fiveHoursInMs + fiveMinutesInMs + fiveSecondsInMs + 1;
        const time2 = fiveMinutesInMs + fiveSecondsInMs + 1;

        expect(formatDurationInMs(time1, true)).toEqual('05h 06m');
        expect(formatDurationInMs(time2, true)).toEqual('05m 06s');
      });

      it('does not round up the last value when the last value is a whole number', () => {
        const time1 = fiveHoursInMs + fiveMinutesInMs;
        const time2 = fiveMinutesInMs + fiveSecondsInMs;

        expect(formatDurationInMs(time1, true)).toEqual('05h 05m');
        expect(formatDurationInMs(time2, true)).toEqual('05m 05s');
      });
    });
  });

  describe('deconstructFormattedDuration', () => {
    const fiveSecondsInMs = 5 * 1000;
    const fiveMinutesInMs = 5 * 60 * 1000;
    const fiveHoursInMs = 5 * 60 * 60 * 1000;

    it('returns all parts of a duration as an object', () => {
      const time = fiveHoursInMs + fiveMinutesInMs + fiveSecondsInMs;
      const duration = formatDurationInMs(time);

      expect(deconstructFormattedDuration(duration)).toEqual({
        firstPart: '05',
        firstDenotation: 'h',
        secondPart: '05',
        secondDenotation: 'm',
      });
    });
  });
});
