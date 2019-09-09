import { goalsReducer } from '../../../src/store/goals/reducers';

describe('goals reducer', () => {
  it('returns the initial state', () => {
    expect(goalsReducer(undefined, { type: '' })).toEqual({
      byId: {},
      allIds: [],
    });
  });
});
