import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../types';
import { EDIT_TIMETABLE_ENTRY, TimetableEntry, TimetableEntryActionTypes } from './types';

export const editTimetableEntry: ActionCreator<ThunkAction<void, StoreState, void, TimetableEntryActionTypes>> = (timetableEntry: TimetableEntry) => {
  return (dispatch, getState) => {
    const timetableEntryPreviousState = getState().timetableEntries.byId[timetableEntry.id];

    dispatch({
      type: EDIT_TIMETABLE_ENTRY,
      timetableEntry: timetableEntry,
      timetableEntryPreviousState,
    });
  };
};
