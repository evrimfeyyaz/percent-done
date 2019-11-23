import { AnyAction, combineReducers, Reducer } from 'redux';
import {
  ADD_TIMETABLE_ENTRY,
  EDIT_TIMETABLE_ENTRY,
  DELETE_TIMETABLE_ENTRY,
  TimetableEntriesState,
  TimetableEntry,
  TimetableEntryActionTypes,
} from './types';
import { NormalizedEntityById } from '../types';
import _ from 'lodash';
import { convertDateToIndex } from '../../utilities';

const byId: Reducer<NormalizedEntityById<TimetableEntry>, TimetableEntryActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
    case EDIT_TIMETABLE_ENTRY:
      return { ...state, [action.timetableEntry.id]: action.timetableEntry };
    case DELETE_TIMETABLE_ENTRY:
      return _.omit(state, action.timetableEntryId);
    default:
      return state;
  }
};

const allIds: Reducer<string[], TimetableEntryActionTypes> = (state = [], action) => {
  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
      return _.uniq([...state, action.timetableEntry.id]);
    case DELETE_TIMETABLE_ENTRY:
      return _.without(state, action.timetableEntryId);
    default:
      return state;
  }
};

const idsByDate: Reducer<{ [date: string]: string[] }, TimetableEntryActionTypes> = (state = {}, action) => {
  let entry: TimetableEntry, dateIdx: string, ids: string[];

  switch (action.type) {
    case EDIT_TIMETABLE_ENTRY:
      entry = action.timetableEntry;
      dateIdx = convertDateToIndex(new Date(entry.startTimestamp));
      ids = state[dateIdx] || [];

      let previousDateIdx;
      if (ids.indexOf(entry.id) === -1) {
        const stateKeys = Object.keys(state);

        for (const index of stateKeys) {
          if (state[index].indexOf(entry.id) !== -1) {
            previousDateIdx = index;
          }
        }
      }

      if (previousDateIdx != null) {
        const previousDateIds = _.without(state[previousDateIdx], entry.id);

        return {
          ...state,
          [dateIdx]: [...ids, entry.id],
          [previousDateIdx]: previousDateIds,
        };
      }

      return { ...state, [dateIdx]: [...ids, entry.id] };
    case ADD_TIMETABLE_ENTRY:
      entry = action.timetableEntry;
      dateIdx = convertDateToIndex(new Date(entry.startTimestamp));
      ids = state[dateIdx] || [];

      return { ...state, [dateIdx]: [...ids, entry.id] };
    case DELETE_TIMETABLE_ENTRY:
      const entryId = action.timetableEntryId;
      const entryStartTimestamp = action.timetableEntryStartTimestamp;
      dateIdx = convertDateToIndex(new Date(entryStartTimestamp));
      ids = _.without(state[dateIdx], entryId);

      return { ...state, [dateIdx]: ids };
    default:
      return state;
  }
};

export const timetableEntriesReducer: Reducer<TimetableEntriesState, AnyAction> = combineReducers({
  byId,
  allIds,
  idsByDate,
});
