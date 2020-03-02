import React from 'react';
import { connect } from 'react-redux';
import { TimetableEntryForm } from '../../components';
import { TimetableEntry, TimetableEntryActionTypes } from '../../store/timetableEntries/types';
import { StoreState } from '../../store/types';
import { getAllGoals } from '../../store/goals/selectors';
import { createProjectAndReturnId } from '../../store/projects/thunks';
import { ThunkDispatch } from 'redux-thunk';
import { ProjectActionTypes } from '../../store/projects/types';
import { getAllProjects } from '../../store/projects/selectors';
import { addTimetableEntry } from '../../store/timetableEntries/thunks';
import { WithOptionalId } from '../../utilities/types';

const mapStateToProps = (state: StoreState) => ({
  allGoals: getAllGoals(state).sort((goal1, goal2) => goal1.title.localeCompare(goal2.title)),
  projects: getAllProjects(state).map(project => ({ key: project.id, title: project.title })),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, TimetableEntryActionTypes | ProjectActionTypes>) => ({
  onSubmit: (timetableEntry: WithOptionalId<TimetableEntry>) => dispatch(addTimetableEntry(timetableEntry)),
  onProjectCreatePress: (title: string) => dispatch(createProjectAndReturnId(title)) as unknown as string,
});

export const AddTimetableEntryForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(TimetableEntryForm);
