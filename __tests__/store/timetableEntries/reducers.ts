import { timetableEntriesReducer } from '../../../src/store/timetableEntries/reducers';

describe('timetable entries reducer', () => {
  it('returns the initial state', () => {
    expect(timetableEntriesReducer(undefined, { type: '' })).toEqual({
      byId: {},
      allIds: [],
      idsByDate: {},
      idsByProjectId: {},
    });
  });
});
