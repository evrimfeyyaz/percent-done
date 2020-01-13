import React from 'react';
import { AnyAction } from 'redux';
import { addProject } from '../store/projects/actions';
import { Project } from '../store/projects/types';
import { connect } from 'react-redux';
import { ProjectForm, ProjectFormProps } from '../components';
import { StoreState } from '../store/types';
import { getAllProjects } from '../store/projects/selectors';
import { ThunkDispatch } from 'redux-thunk';
import { WithOptionalId } from '../utilities/types';

const mapStateToProps = (state: StoreState): ProjectFormProps => ({
  allProjectTitles: getAllProjects(state).map(project => project.title),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>) => ({
  onSubmit: (project: WithOptionalId<Project>) => dispatch(addProject(project.title)),
});

export const AddProjectForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ProjectForm);
