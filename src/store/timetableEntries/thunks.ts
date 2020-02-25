import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../types';
import { ADD_TIMETABLE_ENTRY, TimetableEntry, TimetableEntryActionTypes } from './types';
import { createRandomId, momentWithDeviceLocale } from '../../utilities';
import _ from 'lodash';
import { WithOptionalId } from '../../utilities/types';

export const addTimetableEntry = (timetableEntry: WithOptionalId<TimetableEntry>): ThunkAction<void, StoreState, void, TimetableEntryActionTypes> => {
  return (dispatch) => {
    let entry = _.clone(timetableEntry);
    const timetableEntries = [];

    let startMoment = momentWithDeviceLocale(entry.startTimestamp);
    let endMoment = momentWithDeviceLocale(entry.endTimestamp);

    while (!startMoment.isSame(endMoment, 'day')) {
      const earlierPartOfEntry = _.clone(entry);
      earlierPartOfEntry.endTimestamp = +startMoment.endOf('day');
      timetableEntries.push(earlierPartOfEntry);

      entry.startTimestamp = +startMoment.add(1, 'day').startOf('day');

      startMoment = momentWithDeviceLocale(entry.startTimestamp);
      endMoment = momentWithDeviceLocale(entry.endTimestamp);
    }

    timetableEntries.push(entry);

    timetableEntries.forEach(timetableEntry => dispatch({
      type: ADD_TIMETABLE_ENTRY,
      timetableEntry: { ...timetableEntry, id: createRandomId() },
    }));
  };
};
