import { AnyAction, combineReducers, Reducer } from 'redux';
import { TimetableEntry, TimetableEntriesState, ADD_TIMETABLE_ENTRY, TimetableEntryActionTypes } from './types';
import { NormalizedEntityById } from '../types';
import _ from 'lodash';
import { convertDateToIndex } from '../../utilities';

const byId: Reducer<NormalizedEntityById<TimetableEntry>, TimetableEntryActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
      return { ...state, [action.timetableEntry.id]: action.timetableEntry };
    default:
      return state;
  }
};

const allIds: Reducer<string[], TimetableEntryActionTypes> = (state = [], action) => {
  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
      return _.uniq([...state, action.timetableEntry.id]);
    default:
      return state;
  }
};

const idsByDate: Reducer<{ [date: string]: string[] }, TimetableEntryActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
      const entry = action.timetableEntry;
      const dateIdx = convertDateToIndex(new Date(entry.startTimestamp));
      const ids = state[dateIdx] || [];

      return { ...state, [dateIdx]: [...ids, entry.id] };
    default:
      return state;
  }
};

export const timetableEntriesReducer: Reducer<TimetableEntriesState, AnyAction> = combineReducers({
  byId,
  allIds,
  idsByDate,
});
