import React from 'react';
import { StoreState } from '../store/types';
import { connect } from 'react-redux';
import { ProjectList, ProjectListProps } from '../components';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { convertProjectsToProjectRowProps, getAllProjects } from '../store/projects/selectors';

interface AllProjectsProps {
  onEditActionInteraction?: (projectId: string) => void;
}

const mapStateToProps = (state: StoreState): ProjectListProps => ({
  projects: convertProjectsToProjectRowProps(state, getAllProjects(state)),
  emptyText: 'You haven\'t added any goals yet.',
});

const mapDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, AnyAction>, ownProps: AllProjectsProps) => ({
  onEditActionInteraction: ownProps.onEditActionInteraction,
});

export const AllProjects = connect(mapStateToProps, mapDispatchToProps)(ProjectList);
