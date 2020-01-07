import React, { Component } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { TextButton, TextInput } from '..';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Project } from '../../store/projects/types';

interface ProjectFormState {
  title: string;
  titleInputError?: string;
}

// TODO: Require unique project names (don't include deleted projects in the uniqueness check).
export interface ProjectFormProps {
  project?: Project;
  /**
   * @param project
   * @param projectOld The version of the project before being edited.
   */
  onSubmit?: (project: Project, projectOld: Project) => void;
  onDelete?: (project: Project) => void;
}

export class ProjectForm extends Component<ProjectFormProps, ProjectFormState> {
  state: ProjectFormState = {
    title: this.props.project?.title || '',
  };

  private handleTitleChange = (title: string) => {
    this.setState({
      title,
      titleInputError: undefined,
    });
  };

  private handleDeletePress = () => {
    const { onDelete, project } = this.props;

    if (project == null) throw new Error('Project cannot be null on the edit form.');

    Alert.alert(
      'Delete Project?',
      'This project will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Project', onPress: () => onDelete?.(project), style: 'destructive' },
      ],
      { cancelable: true },
    );
  };

  validate(): boolean {
    const { title } = this.state;
    let validates = true;
    let titleInputError = this.state.titleInputError;

    if (title == null || title.trim().length === 0) {
      titleInputError = 'You need to enter a title.';
      validates = false;
    }

    this.setState({ titleInputError });

    return validates;
  }

  /**
   * Submits the form, and returns `true` if the submission is successful,
   * and `false` otherwise.
   */
  submit(): boolean {
    if (!this.validate()) {
      return false;
    }

    const { project } = this.props;
    if (project == null) throw new Error('Project cannot be null on the edit form.');

    const { title } = this.state;
    const { id } = project;

    this.props.onSubmit?.({ id, title }, project);

    return true;
  }

  render() {
    const { title, titleInputError } = this.state;

    return (
      <KeyboardAwareScrollView style={styles.container} keyboardDismissMode='on-drag'
        // @ts-ignore
                               keyboardOpeningTime={100} scrollToOverflowEnabled={true}>
        <TextInput placeholder='What is the title of the project?' onChangeText={this.handleTitleChange}
                   value={title} error={titleInputError} />

        <View style={styles.deleteButtonContainer}>
          <TextButton title='Delete Project' onPress={this.handleDeletePress} />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  deleteButtonContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
});
