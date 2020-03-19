import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  handleCompleteOrTrackRequest,
  startGoalTracking, stopGoalTracking,
  updateTrackedGoalStartTimestamp,
} from '../../../src/store/goals/thunks';
import { createGoal, createStoreState, createTimetableEntry } from '../../../src/factories';
import { StoreState } from '../../../src/store/types';
import { AnyAction } from 'redux';
import {
  Goal, REMOVE_TRACKED_GOAL,
  SET_TRACKED_GOAL,
  TrackedGoalState,
  UPDATE_TRACKED_GOAL_START_TIMESTAMP,
} from '../../../src/store/goals/types';
import { ADD_TIMETABLE_ENTRY, DELETE_TIMETABLE_ENTRY } from '../../../src/store/timetableEntries/types';
import { momentWithDeviceLocale, NavigationService } from '../../../src/utilities';
import {
  SET_SCHEDULED_BREAK_NOTIFICATION_ID,
  SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID, SET_SHOULD_TAKE_BREAK,
  SettingsState,
} from '../../../src/store/settings/types';
import { cancelLocalNotification, scheduleLocalNotification } from '../../../src/utilities/localNotifications';

const middlewares = [thunk];
const mockStore = configureStore<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>(middlewares);

describe('goal thunks', () => {
  describe('handleCompleteOrTrackRequest', () => {
    describe('given a time-tracked-goal', () => {
      it('sets it as the current tracked goal', () => {
        const goal = createGoal({ durationInMin: 30, recurringEveryDay: true });
        const state = createStoreState({ goals: [goal] });
        const store = mockStore(state);

        store.dispatch(handleCompleteOrTrackRequest(goal.id));

        const actionTypes = store.getActions().map(action => action.type);

        expect(actionTypes).toContain(SET_TRACKED_GOAL);
      });
    });

    describe('given a non-time-tracked goal', () => {
      it('adds a timetable entry when the goal is not completed', () => {
        const goal = createGoal({ recurringEveryDay: true });
        const state = createStoreState({ goals: [goal] });
        const store = mockStore(state);

        store.dispatch(handleCompleteOrTrackRequest(goal.id));

        const actionTypes = store.getActions().map(action => action.type);

        expect(actionTypes).toEqual([ADD_TIMETABLE_ENTRY]);
      });

      it('removes the old timetable entry when the goal is completed', () => {
        const goal = createGoal({ recurringEveryDay: true });
        const timetableEntry = createTimetableEntry({
          goalId: goal.id,
          startDate: new Date(),
          startHour: 10,
          durationInMin: 0,
        });
        const state = createStoreState({ goals: [goal], timetableEntries: [timetableEntry] });
        const store = mockStore(state);

        store.dispatch(handleCompleteOrTrackRequest(goal.id));

        const actions = store.getActions();

        expect(actions).toEqual([{
          type: DELETE_TIMETABLE_ENTRY,
          timetableEntry,
        }]);
      });
    });
  });

  describe('startGoalTracking', () => {
    let goal: Goal;
    const goalDuration = 30;
    let state: StoreState;
    let store: MockStoreEnhanced<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>;

    beforeEach(() => {
      goal = createGoal({ durationInMin: goalDuration, recurringEveryDay: true });
      state = createStoreState({ goals: [goal] });
      store = mockStore(state);
    });

    it('schedules a goal completed notification', () => {
      store.dispatch(startGoalTracking(goal.id));
      const actionTypes = store.getActions().map(action => action.type);
      const thirtyMinutesFromNow = +momentWithDeviceLocale().add(goalDuration, 'minutes');

      expect(actionTypes).toContainEqual(SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID);
      // Scheduled time should be within 100ms of thirty minutes from now.
      const scheduledDate = (scheduleLocalNotification as jest.MockedFunction<any>).mock.calls[0][1].getTime();
      expect(scheduledDate).toBeLessThanOrEqual(thirtyMinutesFromNow + 100);
      expect(scheduledDate).toBeGreaterThanOrEqual(thirtyMinutesFromNow - 100);
    });

    it('navigates to the goal tracking screen', () => {
      store.dispatch(startGoalTracking(goal.id));

      expect(NavigationService.navigate).toBeCalledWith('TrackGoal', {});
    });

    it('schedules a break notification when break notifications are on', () => {
      const breakAfter = 25 * 60 * 1000;
      state = createStoreState({
        goals: [goal],
        settings: { notifyBreakAfterInMs: breakAfter, areBreakNotificationsOn: true },
      });
      store = mockStore(state);
      store.dispatch(startGoalTracking(goal.id));
      const actionTypes = store.getActions().map(action => action.type);
      const twentyFiveMinutesFromNow = +momentWithDeviceLocale().add(breakAfter, 'ms');

      expect(actionTypes).toContain(SET_SCHEDULED_BREAK_NOTIFICATION_ID);
      expect(scheduleLocalNotification).toBeCalledTimes(2);
      // Scheduled time should be within five seconds of twenty five minutes from now.
      const scheduledDate = (scheduleLocalNotification as jest.MockedFunction<any>).mock.calls[1][1].getTime();
      expect(scheduledDate).toBeLessThanOrEqual(twentyFiveMinutesFromNow + 5000);
      expect(scheduledDate).toBeGreaterThanOrEqual(twentyFiveMinutesFromNow - 5000);
    });

    it('does not schedule a break notification when break notifications are off', () => {
      store.dispatch(startGoalTracking(goal.id));

      const actionTypes = store.getActions().map(action => action.type);
      expect(actionTypes).not.toContain(SET_SCHEDULED_BREAK_NOTIFICATION_ID);
      expect(scheduleLocalNotification).toBeCalled();
    });
  });

  describe('updateTrackedGoalStartTimestamp', () => {
    let store: MockStoreEnhanced<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>;
    let newTimestamp: number;

    beforeEach(() => {
      const goal = createGoal({ durationInMin: 30, recurringEveryDay: true });
      const trackedGoal: TrackedGoalState = {
        id: goal.id,
        startTimestamp: Date.now(),
      };
      const settings: Partial<SettingsState> = {
        scheduledGoalCompletedNotificationId: 'SOME_NOTIFICATION_ID',
        scheduledBreakNotificationId: 'SOME_NOTIFICATION_ID',
        areBreakNotificationsOn: true,
        notifyBreakAfterInMs: 25 * 60 * 1000,
      };
      const state = createStoreState({ goals: [goal], trackedGoal, settings });
      store = mockStore(state);

      newTimestamp = Date.now();
      store.dispatch(updateTrackedGoalStartTimestamp(newTimestamp));
    });

    it('cancels the scheduled goal completed notification and schedules a new one', () => {
      const actionTypes = store.getActions().map(action => action.type);

      expect(actionTypes).toContain(SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID);
      expect(cancelLocalNotification).toBeCalled();
      expect(scheduleLocalNotification).toBeCalled();
    });

    it('cancels the scheduled break notification and schedules a new one', () => {
      const actionTypes = store.getActions().map(action => action.type);

      expect(actionTypes).toContain(SET_SCHEDULED_BREAK_NOTIFICATION_ID);
      expect(cancelLocalNotification).toBeCalledTimes(2);
      expect(scheduleLocalNotification).toBeCalledTimes(2);
    });

    it('updates the tracked goal timestamp', () => {
      const actionTypes = store.getActions().map(action => action.type);

      expect(actionTypes).toContain(UPDATE_TRACKED_GOAL_START_TIMESTAMP);
    });
  });

  describe('stopGoalTracking', () => {
    let store: MockStoreEnhanced<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>;
    let actionTypes: string[];
    let actions: AnyAction[];
    let goal: Goal;
    const projectId = 'SOME_PROJECT_ID';

    beforeEach(() => {
      goal = createGoal({ durationInMin: 30, recurringEveryDay: true });
      const trackedGoal: TrackedGoalState = {
        id: goal.id,
        startTimestamp: Date.now(),
        projectId,
      };
      const settings: Partial<SettingsState> = {
        scheduledGoalCompletedNotificationId: 'SOME_NOTIFICATION_ID',
        scheduledBreakNotificationId: 'SOME_NOTIFICATION_ID',
        areBreakNotificationsOn: true,
        notifyBreakAfterInMs: 25 * 60 * 1000,
      };
      const state = createStoreState({ goals: [goal], trackedGoal, settings });
      store = mockStore(state);

      store.dispatch(stopGoalTracking());
      actions = store.getActions();
      actionTypes = actions.map(action => action.type);
    });

    it('cleans the current tracked goal setting', () => {
      expect(actionTypes).toContain(REMOVE_TRACKED_GOAL);
    });

    it('adds a timetable entry for the tracked time', () => {
      expect(actionTypes).toContain(ADD_TIMETABLE_ENTRY);
    });

    it('cancels the scheduled goal completed notification', () => {
      expect(actionTypes).toContain(SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID);
      expect(cancelLocalNotification).toBeCalled();
    });

    it('cancels the scheduled break notification', () => {
      expect(actionTypes).toContain(SET_SCHEDULED_BREAK_NOTIFICATION_ID);
      expect(cancelLocalNotification).toBeCalledTimes(2);
    });

    it('sets the should take a break setting off', () => {
      expect(actions).toContainEqual({
        type: SET_SHOULD_TAKE_BREAK,
        shouldTakeBreak: false,
      });
    });
  });
});
