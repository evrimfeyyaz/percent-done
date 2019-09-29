import { AnyAction, combineReducers, Reducer } from 'redux';
import {
  TimetableEntry,
  TimetableEntriesState,
  ADD_TIMETABLE_ENTRY,
  TimetableEntryActionTypes,
  REMOVE_TIMETABLE_ENTRY,
} from './types';
import { NormalizedEntityById } from '../types';
import _ from 'lodash';
import { convertDateToIndex } from '../../utilities';

const byId: Reducer<NormalizedEntityById<TimetableEntry>, TimetableEntryActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
      return { ...state, [action.timetableEntry.id]: action.timetableEntry };
    case REMOVE_TIMETABLE_ENTRY:
      return _.omit(state, action.timetableEntry.id);
    default:
      return state;
  }
};

const allIds: Reducer<string[], TimetableEntryActionTypes> = (state = [], action) => {
  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
      return _.uniq([...state, action.timetableEntry.id]);
    case REMOVE_TIMETABLE_ENTRY:
      return state.filter(id => id !== action.timetableEntry.id);
    default:
      return state;
  }
};

const idsByDate: Reducer<{ [date: string]: string[] }, TimetableEntryActionTypes> = (state = {}, action) => {
  let entry: TimetableEntry, dateIdx: string, ids: string[];

  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
      entry = action.timetableEntry;
      dateIdx = convertDateToIndex(new Date(entry.startTimestamp));
      ids = state[dateIdx] || [];

      return { ...state, [dateIdx]: [...ids, entry.id] };
    case REMOVE_TIMETABLE_ENTRY:
      entry = action.timetableEntry;
      dateIdx = convertDateToIndex(new Date(entry.startTimestamp));
      ids = state[dateIdx].filter(id => id !== entry.id);

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
