import { settingsReducer } from '../../../src/store/settings/reducers';

describe('settings reducer', () => {
  it('returns the initial state', () => {
    // @ts-ignore
    const initialState = settingsReducer(undefined, { type: undefined });

    expect(initialState.statsPeriodKey).toEqual('7');
    expect(typeof initialState.timeMachineDateTimestamp).toEqual('number');
    expect(initialState.currentDateTimestamp).toBeUndefined();
    expect(initialState.scheduledGoalCompletedNotificationId).toBeUndefined();
  });
});
