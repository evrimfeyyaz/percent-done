import { settingsReducer } from '../../../src/store/settings/reducers';
import {
  setCurrentDateTimestamp, setOnboarded, setScheduledGoalCompletedNotificationId,
  setStatsPeriodKey,
  setTimeMachineDateTimestamp,
} from '../../../src/store/settings/actions';

describe('settings reducer', () => {
  // @ts-ignore
  const initialState = settingsReducer(undefined, { type: undefined });

  it('returns the initial state', () => {
    expect(initialState.statsPeriodKey).toEqual('7');
    expect(typeof initialState.timeMachineDateTimestamp).toEqual('number');
    expect(initialState.currentDateTimestamp).toBeUndefined();
    expect(initialState.scheduledGoalCompletedNotificationId).toBeUndefined();
  });

  it('handles setting the current date timestamp', () => {
    const timestamp = Date.now();
    const action = setCurrentDateTimestamp(timestamp);

    const result = settingsReducer(initialState, action);

    expect(result.currentDateTimestamp).toEqual(timestamp);
  });

  it('handles setting the time machine date timestamp', () => {
    const timestamp = Date.now();
    const action = setTimeMachineDateTimestamp(timestamp);

    const result = settingsReducer(initialState, action);

    expect(result.timeMachineDateTimestamp).toEqual(timestamp);
  });

  it('handles setting the stats period key', () => {
    const period = '30';
    const action = setStatsPeriodKey(period);

    const result = settingsReducer(initialState, action);

    expect(result.statsPeriodKey).toEqual(period);
  });

  it('handles setting the scheduled goal completed notification ID', () => {
    const id = 'SOME_NOTIFICATION_ID';
    const action = setScheduledGoalCompletedNotificationId(id);

    const result = settingsReducer(initialState, action);

    expect(result.scheduledGoalCompletedNotificationId).toEqual(id);
  });

  it('handles setting the variable denoting whether a user has been onboarded', () => {
    const onboarded = true;
    const action = setOnboarded(onboarded);

    const result = settingsReducer(initialState, action);

    expect(result.hasOnboarded).toEqual(onboarded);
  });
});
