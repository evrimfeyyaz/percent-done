import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TimetableEntryForm } from '../components';
import { TimetableEntry, TimetableEntryActionTypes } from '../store/timetableEntries/types';
import { addTimetableEntry } from '../store/timetableEntries/actions';
import { StoreState } from '../store/types';
import { getAllGoals } from '../store/goals/selectors';

const mapDispatchToProps = (dispatch: Dispatch<TimetableEntryActionTypes>) => ({
  onSubmit: (timetableEntry: TimetableEntry) => dispatch(addTimetableEntry(timetableEntry)),
});

const mapStateToProps = (state: StoreState) => ({
  // TODO: Sort all goals by title in ascending order.
  allGoals: getAllGoals(state),
});

export const AddTimetableEntryForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(TimetableEntryForm);
