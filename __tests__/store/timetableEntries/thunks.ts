import thunk, { ThunkDispatch } from 'redux-thunk';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { StoreState } from '../../../src/store/types';
import { AnyAction } from 'redux';
import { createStoreState, createTimetableEntry } from '../../../src/factories';
import { ADD_TIMETABLE_ENTRY, TimetableEntry } from '../../../src/store/timetableEntries/types';
import { addTimetableEntry } from '../../../src/store/timetableEntries/thunks';
import { momentWithDeviceLocale } from '../../../src/utilities';

const middlewares = [thunk];
const mockStore = configureStore<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>(middlewares);

describe('timetable entry thunks', () => {
  let state: StoreState;
  let store: MockStoreEnhanced<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>;
  let entry: TimetableEntry;

  beforeAll(() => {
    state = createStoreState({});
    store = mockStore(state);
    entry = createTimetableEntry({ startDate: new Date(), startHour: 10, durationInMin: 30 });
  });

  beforeEach(() => {
    store.clearActions();
  });

  describe('addTimetableEntry', () => {
    it('adds an entry', () => {
      store.dispatch(addTimetableEntry(entry));
      const actionTypes = store.getActions().map(action => action.type);

      expect(actionTypes).toContain(ADD_TIMETABLE_ENTRY);
    });

    it('when given tracked time spans multiple days, adds multiple entries for each day', () => {
      const { startTimestamp } = entry;
      const endOfDay = +momentWithDeviceLocale(startTimestamp).endOf('day');
      const nextDaySameTime = +momentWithDeviceLocale(startTimestamp).add(1, 'day');
      const nextDayBeginningOfDay = +momentWithDeviceLocale(nextDaySameTime).startOf('day');

      entry.endTimestamp = nextDaySameTime;

      store.dispatch(addTimetableEntry(entry));
      const actions = store.getActions();

      expect(actions).toEqual([
        {
          type: ADD_TIMETABLE_ENTRY,
          timetableEntry: expect.objectContaining({
            ...entry,
            id: expect.any(String),
            endTimestamp: endOfDay,
          }),
        },
        {
          type: ADD_TIMETABLE_ENTRY,
          timetableEntry: expect.objectContaining({
            ...entry,
            id: expect.any(String),
            startTimestamp: nextDayBeginningOfDay,
          }),
        },
      ]);
    });
  });
});
