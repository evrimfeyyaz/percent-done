import { projectsReducer } from '../../../src/store/projects/reducers';

describe('projects reducer', () => {
  it('returns the initial state', () => {
    // @ts-ignore
    expect(projectsReducer(undefined, { type: undefined })).toEqual({
      byId: {},
      idByTitle: {},
      allIds: [],
    });
  });
});
