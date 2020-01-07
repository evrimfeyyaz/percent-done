import React from 'react';
import { connect } from 'react-redux';
import { TimetableEntryForm } from '../components';
import { StoreState } from '../store/types';
import { getTimetableEntryById } from '../store/timetableEntries/selectors';
import { TimetableEntry, TimetableEntryActionTypes } from '../store/timetableEntries/types';
import { deleteTimetableEntry, editTimetableEntry } from '../store/timetableEntries/actions';
import { getAllGoals } from '../store/goals/selectors';
import { ThunkDispatch } from 'redux-thunk';
import { getAllProjects } from '../store/projects/selectors';
import { ProjectActionTypes } from '../store/projects/types';
import { createProjectAndReturnId } from '../store/projects/thunks';

interface EditTimetableEntryFormProps {
  timetableEntryId: string;
  onDelete?: () => void;
}

const mapStateToProps = (state: StoreState, ownProps: EditTimetableEntryFormProps) => ({
  allGoals: getAllGoals(state),
  timetableEntry: getTimetableEntryById(state, ownProps.timetableEntryId),
  projects: getAllProjects(state).map(project => ({ key: project.id, title: project.title })),
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, void, TimetableEntryActionTypes | ProjectActionTypes>,
  ownProps: EditTimetableEntryFormProps,
) => ({
  onSubmit: (timetableEntry: TimetableEntry, oldTimetableEntry?: TimetableEntry) =>
    dispatch(editTimetableEntry(timetableEntry, oldTimetableEntry as TimetableEntry)),
  onDelete: (timetableEntry: TimetableEntry) => {
    ownProps.onDelete?.();
    dispatch(deleteTimetableEntry(timetableEntry));
  },
  onProjectCreatePress: (title: string) => dispatch(createProjectAndReturnId(title)) as unknown as string,
});

export const EditTimetableEntryForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(TimetableEntryForm);
