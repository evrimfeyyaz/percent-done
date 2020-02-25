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
  EDIT_GOAL,
  Goal, REMOVE_TRACKED_GOAL,
  SET_TRACKED_GOAL,
  TrackedGoalState,
  UPDATE_TRACKED_GOAL_START_TIMESTAMP,
} from '../../../src/store/goals/types';
import { ADD_TIMETABLE_ENTRY, DELETE_TIMETABLE_ENTRY } from '../../../src/store/timetableEntries/types';
import { NavigationService } from '../../../src/utilities';
import PushNotification from 'react-native-push-notification';
import { SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID, SettingsState } from '../../../src/store/settings/types';

const middlewares = [thunk];
const mockStore = configureStore<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>(middlewares);

describe('goal thunks', () => {
  describe('handleCompleteOrTrackRequest', () => {
    describe('given a time-tracked-goal', () => {
      it('sets it as the current tracked goal', () => {
        const goal = createGoal({ durationInMin: 30 }, [], true);
        const state = createStoreState({ goals: [goal] });
        const store = mockStore(state);

        store.dispatch(handleCompleteOrTrackRequest(goal.id));

        const actionTypes = store.getActions().map(action => action.type);

        expect(actionTypes).toContain(SET_TRACKED_GOAL);
      });
    });

    describe('given a non-time-tracked goal', () => {
      it('adds a timetable entry when the goal is not completed', () => {
        const goal = createGoal({}, [], true);
        const state = createStoreState({ goals: [goal] });
        const store = mockStore(state);

        store.dispatch(handleCompleteOrTrackRequest(goal.id));

        const actionTypes = store.getActions().map(action => action.type);

        expect(actionTypes).toEqual([ADD_TIMETABLE_ENTRY]);
      });

      it('removes the old timetable entry when the goal is completed', () => {
        const goal = createGoal({}, [], true);
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
    let state: StoreState;
    let store: MockStoreEnhanced<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>;

    beforeEach(() => {
      goal = createGoal({ durationInMin: 30 }, [], true);
      state = createStoreState({ goals: [goal] });
      store = mockStore(state);
    });

    it('schedules a goal completed notification', () => {
      store.dispatch(startGoalTracking(goal.id));

      expect(PushNotification.localNotificationSchedule).toBeCalled();
    });

    it('navigates to the goal tracking screen', () => {
      store.dispatch(startGoalTracking(goal.id));

      expect(NavigationService.navigate).toBeCalledWith('TrackGoal', {});
    });
  });

  describe('updateTrackedGoalStartTimestamp', () => {
    let store: MockStoreEnhanced<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>;
    let newTimestamp: number;

    beforeAll(() => {
      const goal = createGoal({ durationInMin: 30 }, [], true);
      const trackedGoal: TrackedGoalState = {
        id: goal.id,
        startTimestamp: Date.now(),
      };
      const settings: Partial<SettingsState> = { scheduledGoalCompletedNotificationId: 'SOME_NOTIFICATION_ID' };
      const state = createStoreState({ goals: [goal], trackedGoal, settings });
      store = mockStore(state);

      newTimestamp = Date.now();
      store.dispatch(updateTrackedGoalStartTimestamp(newTimestamp));
    });

    it('cancels the scheduled goal completed notification and schedules a new one', () => {
      const actionTypes = store.getActions().map(action => action.type);

      expect(actionTypes).toContain(SET_SCHEDULED_GOAL_COMPLETED_NOTIFICATION_ID);
      expect(PushNotification.cancelLocalNotifications).toBeCalled();
      expect(PushNotification.localNotificationSchedule).toBeCalled();
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

    beforeAll(() => {
      goal = createGoal({ durationInMin: 30 }, [], true);
      const trackedGoal: TrackedGoalState = {
        id: goal.id,
        startTimestamp: Date.now(),
        projectId,
      };
      const settings: Partial<SettingsState> = { scheduledGoalCompletedNotificationId: 'SOME_NOTIFICATION_ID' };
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

    it('sets given project ID as the last project ID of the tracked goal', () => {
      expect(actions).toContainEqual({
        type: EDIT_GOAL,
        goal: {
          ...goal,
          lastProjectId: projectId,
        },
      });
    });

    it('cancels the scheduled goal completed notification', () => {
      expect(PushNotification.cancelLocalNotifications).toBeCalled();
    });
  });
});
