import React from 'react';
import { Dispatch } from 'redux';
import { deleteProject, editProject } from '../store/projects/actions';
import { Project, ProjectActionTypes } from '../store/projects/types';
import { connect } from 'react-redux';
import { ProjectForm, ProjectFormProps } from '../components';
import { StoreState } from '../store/types';
import { getProjectById } from '../store/projects/selectors';

interface EditProjectFormProps {
  projectId: string;
  onDelete?: () => void;
}

const mapStateToProps = (state: StoreState, ownProps: EditProjectFormProps): ProjectFormProps => ({
  project: getProjectById(state, ownProps.projectId),
});

const mapDispatchToProps = (dispatch: Dispatch<ProjectActionTypes>, ownProps: EditProjectFormProps) => ({
  onSubmit: (project: Project, projectOld: Project) => dispatch(editProject(project, projectOld)),
  onDelete: (project: Project) => {
    ownProps.onDelete?.();
    dispatch(deleteProject(project));
  },
});

export const EditProjectForm = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ProjectForm);
