import {
  compareDateIndices,
  convertDateToIndex,
  convertSecondsToHoursAndMinutes,
  isLocale24Hours,
} from '../../src/utilities';
import timezone_mock from 'timezone-mock';

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
    const seconds = 3600; // 1 hour;

    const { hours, minutes } = convertSecondsToHoursAndMinutes(seconds);

    expect(hours).toEqual(1);
    expect(minutes).toEqual(0);
  });
});

describe('isLocale24Hours', () => {
  it('returns true if current locale is 24 hours', () => {
    timezone_mock.register('Europe/London');
    const result = isLocale24Hours();
    timezone_mock.unregister();

    expect(result).toEqual(true);
  });

  it('returns false if current locale is 12 hours', () => {
    timezone_mock.register('US/Pacific');
    const result = isLocale24Hours();
    timezone_mock.unregister();

    expect(result).toEqual(false);
  });
});
