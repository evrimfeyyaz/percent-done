import { compareDateIndices, convertDateToIndex } from '../../src/utilities';

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
  })
});
