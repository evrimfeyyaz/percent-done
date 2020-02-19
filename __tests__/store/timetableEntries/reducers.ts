import { timetableEntriesReducer } from '../../../src/store/timetableEntries/reducers';

describe('timetable entries reducer', () => {
  it('returns the initial state', () => {
    // @ts-ignore
    expect(timetableEntriesReducer(undefined, { type: undefined })).toEqual({
      byId: {},
      allIds: [],
      idsByDate: {},
      idsByProjectId: {},
      idsByGoalId: {},
    });
  });
});
