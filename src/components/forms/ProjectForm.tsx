import React, { Component } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { TextButton, TextInput } from '..';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Project } from '../../store/projects/types';
import { WithOptionalId } from '../../utilities/types';

export interface ProjectFormProps {
  project?: Project;
  allProjectTitles: string[];
  /**
   * @param project
   * @param projectOld The version of the project before being edited.
   */
  onSubmit?: (project: WithOptionalId<Project>, projectOld?: Project) => void;
  onDelete?: (project: Project) => void;
}

interface ProjectFormState {
  title: string;
  titleInputError?: string;
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

  /**
   * Returns `true` when this form is an "add new project" form, and `false`
   * when it is an "edit project" form.
   */
  private isAddNewForm = () => {
    console.log(this.props.project);
    return this.props.project == null;
  };

  validate(): boolean {
    const { title } = this.state;
    const { allProjectTitles, project } = this.props;
    let validates = true;
    let titleInputError = this.state.titleInputError;

    if (title == null || title.trim().length === 0) {
      titleInputError = 'You need to enter a title.';
      validates = false;
    }

    if (
      project?.title !== title &&
      allProjectTitles.some(existingTitle => existingTitle.toLowerCase() === title.toLowerCase())
    ) {
      titleInputError = 'Another project with this title already exists.';
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

    let id: string | undefined = undefined;
    const { title } = this.state;

    if (this.isAddNewForm()) {
      this.props.onSubmit?.({ title });
    } else {
      const { project } = this.props;
      if (project == null) throw new Error('Project cannot be null on the edit form.');

      id = this.props.project?.id;

      this.props.onSubmit?.({ id, title }, project);
    }

    return true;
  }

  render() {
    const { title, titleInputError } = this.state;

    return (
      <KeyboardAwareScrollView style={styles.container} keyboardDismissMode='on-drag' alwaysBounceVertical={false}
        // @ts-ignore
                               keyboardOpeningTime={100} scrollToOverflowEnabled={true}>
        <TextInput placeholder='What is the title of the project?' onChangeText={this.handleTitleChange}
                   value={title} error={titleInputError} />

        {!this.isAddNewForm() && (
          <View style={styles.deleteButtonContainer}>
            <TextButton title='Delete Project' onPress={this.handleDeletePress} />
          </View>
        )}
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
