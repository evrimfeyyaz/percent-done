import React from 'react';
import { connect } from 'react-redux';
import { TimetableEntryForm } from '../components';
import { StoreState } from '../store/types';
import { getTimetableEntryById } from '../store/timetableEntries/selectors';
import { TimetableEntry, TimetableEntryActionTypes } from '../store/timetableEntries/types';
import { deleteTimetableEntry } from '../store/timetableEntries/actions';
import { getAllGoals } from '../store/goals/selectors';
import { editTimetableEntry } from '../store/timetableEntries/thunks';
import { ThunkDispatch } from 'redux-thunk';

interface EditTimetableEntryFormProps {
  timetableEntryId: string;
  onDelete?: () => void;
}

const mapStateToProps = (state: StoreState, ownProps: EditTimetableEntryFormProps) => ({
  allGoals: getAllGoals(state),
  timetableEntry: getTimetableEntryById(state, ownProps.timetableEntryId),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, TimetableEntryActionTypes>, ownProps: EditTimetableEntryFormProps) => ({
  onSubmit: (timetableEntry: TimetableEntry) => dispatch(editTimetableEntry(timetableEntry)),
  onDelete: (timetableEntry: TimetableEntry) => {
    ownProps.onDelete?.();
    dispatch(deleteTimetableEntry(timetableEntry));
  },
});

export const EditTimetableEntryForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(TimetableEntryForm);
