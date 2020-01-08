import React from 'react';
import { AnyAction } from 'redux';
import { editProject } from '../store/projects/actions';
import { Project } from '../store/projects/types';
import { connect } from 'react-redux';
import { ProjectForm, ProjectFormProps } from '../components';
import { StoreState } from '../store/types';
import { getAllProjects, getProjectById } from '../store/projects/selectors';
import { deleteProject } from '../store/projects/thunks';
import { ThunkDispatch } from 'redux-thunk';

interface EditProjectFormProps {
  projectId: string;
  onDelete?: () => void;
}

const mapStateToProps = (state: StoreState, ownProps: EditProjectFormProps): ProjectFormProps => ({
  project: getProjectById(state, ownProps.projectId),
  allProjectTitles: getAllProjects(state).map(project => project.title),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: EditProjectFormProps) => ({
  onSubmit: (project: Project, projectOld: Project) => dispatch(editProject(project, projectOld)),
  onDelete: (project: Project) => {
    ownProps.onDelete?.();
    dispatch(deleteProject(project));
  },
});

export const EditProjectForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ProjectForm);
