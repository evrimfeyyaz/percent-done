import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TimetableEntryForm } from '../components';
import { StoreState } from '../store/types';
import { getTimetableEntryById } from '../store/timetableEntries/selectors';
import { TimetableEntry, TimetableEntryActionTypes } from '../store/timetableEntries/types';
import { deleteTimetableEntry, editTimetableEntry } from '../store/timetableEntries/actions';
import { getAllGoals } from '../store/goals/selectors';

interface EditTimetableEntryFormProps {
  timetableEntryId: string;
  onDelete?: () => void;
}

const mapStateToProps = (state: StoreState, ownProps: EditTimetableEntryFormProps) => ({
  allGoals: getAllGoals(state),
  timetableEntry: getTimetableEntryById(state, ownProps.timetableEntryId),
});

const mapDispatchToProps = (dispatch: Dispatch<TimetableEntryActionTypes>, ownProps: EditTimetableEntryFormProps) => ({
  onSubmit: (timetableEntry: TimetableEntry) => dispatch(editTimetableEntry(timetableEntry)),
  onDelete: (timetableEntryId: string, timetableEntryStartTimestamp: number) => {
    ownProps.onDelete?.();
    dispatch(deleteTimetableEntry(timetableEntryId, timetableEntryStartTimestamp));
  },
});

export const EditTimetableEntryForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(TimetableEntryForm);
