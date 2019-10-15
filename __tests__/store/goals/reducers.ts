import { goalsReducer } from '../../../src/store/goals/reducers';

describe('goals reducer', () => {
  it('returns the initial state', () => {
    // @ts-ignore
    expect(goalsReducer(undefined, { type: undefined })).toEqual({
      byId: {},
      allIds: [],
    });
  });
});
