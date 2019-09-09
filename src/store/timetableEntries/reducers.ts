import { AnyAction, combineReducers, Reducer } from 'redux';
import { TimetableEntry, TimetableEntriesState } from './types';
import { NormalizedEntityById } from '../types';

const byId: Reducer<NormalizedEntityById<TimetableEntry>, AnyAction> = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const allIds: Reducer<string[], AnyAction> = (state = [], action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const idsByDate: Reducer<{ [date: string]: string[] }, AnyAction> = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const timetableEntriesReducer: Reducer<TimetableEntriesState, AnyAction> = combineReducers({
  byId,
  allIds,
  idsByDate,
});
