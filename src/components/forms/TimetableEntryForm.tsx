import React, { Component } from 'react';
import { DateInput, InputContainer, ItemInput, ProjectModal, TextButton, TimeInput } from '..';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { TimetableEntry } from '../../store/timetableEntries/types';
import { Goal } from '../../store/goals/types';
import { isTimeTracked } from '../../store/goals/utilities';
import { msToHoursMinutesSeconds } from '../../utilities';
import { WithOptionalId } from '../../utilities/types';

export interface TimetableEntryFormProps {
  allGoals: Goal[];
  onSubmit?: (timetableEntry: WithOptionalId<TimetableEntry>, oldTimetableEntry?: WithOptionalId<TimetableEntry>) => void;
  onDelete?: (timetableEntry: WithOptionalId<TimetableEntry>) => void;
  timetableEntry?: TimetableEntry;
  projects: { key: string, title: string }[];
  /**
   * Returns the ID of the created project.
   */
  onProjectCreatePress?: (projectTitle: string) => string;
}

interface TimetableEntryFormState {
  goalId: string;
  projectKey?: string;
  startTimestamp: number;
  endTimestamp: number;
  isSelectedGoalTimeTracked: boolean;
  finishedAtError?: string;
  isProjectModalVisible: boolean;
}

export class TimetableEntryForm extends Component<TimetableEntryFormProps, TimetableEntryFormState> {
  private now = Date.now();
  private goalId = this.props.timetableEntry?.goalId || this.props.allGoals[0].id;
  private goal = this.props.allGoals.find(goal => goal.id === this.goalId);

  state: TimetableEntryFormState = {
    goalId: this.goalId,
    isProjectModalVisible: false,
    projectKey: this.props.timetableEntry?.projectId,
    startTimestamp: this.props.timetableEntry?.startTimestamp || this.now,
    endTimestamp: this.props.timetableEntry?.endTimestamp || this.now,
    isSelectedGoalTimeTracked: this.goal != null ? isTimeTracked(this.goal) : true,
  };

  validate(): boolean {
    const { startTimestamp, endTimestamp } = this.state;
    let validates = true;
    let finishedAtError = this.state.finishedAtError;

    const { hours: startHour, minutes: startMinute } = msToHoursMinutesSeconds(startTimestamp);
    const { hours: endHour, minutes: endMinute } = msToHoursMinutesSeconds(endTimestamp);

    if (startHour > endHour || (startHour === endHour && startMinute > endMinute)) {
      finishedAtError = 'Time travel is cheating.';
      validates = false;
    }

    this.setState({ finishedAtError });

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

    const { onSubmit, timetableEntry: oldTimetableEntry } = this.props;
    let { goalId, startTimestamp, endTimestamp, projectKey } = this.state;

    let id: string | undefined = undefined;
    if (!this.isAddNewForm()) {
      if (oldTimetableEntry == null) throw new Error('Timetable entry cannot be null on the edit form.');

      id = oldTimetableEntry.id;
    }

    const timetableEntry: WithOptionalId<TimetableEntry> = {
      projectId: projectKey,
      startTimestamp,
      endTimestamp,
      goalId,
      id,
    };

    onSubmit?.(timetableEntry, oldTimetableEntry);

    return true;
  }

  componentDidMount(): void {
    const { goalId } = this.state;

    if (goalId != null) {
      this.handleGoalChange(goalId);
    }
  }

  /**
   * Returns `true` when this form is an "add new timetable entry" form, and `false`
   * when it is an "edit timetable entry" form.
   */
  isAddNewForm = () => {
    return this.props.timetableEntry == null;
  };

  isGoalDeleted = () => {
    const { allGoals, timetableEntry } = this.props;

    if (timetableEntry == null) return false;

    return allGoals.map(goal => goal.id).indexOf(timetableEntry.goalId) === -1;
  };

  handleGoalChange = (goalId: string) => {
    const { allGoals } = this.props;
    const goal = allGoals.find(goal => goal.id === goalId);

    if (goal != null) {
      this.setState({
        goalId: goalId,
        isSelectedGoalTimeTracked: isTimeTracked(goal),
      });
    }
  };

  toggleProjectModal = () => this.setState({ isProjectModalVisible: !this.state.isProjectModalVisible });

  handleProjectCreatePress = (title: string) => {
    const projectKey = this.props.onProjectCreatePress?.(title);

    this.setState({ isProjectModalVisible: false, projectKey });
  };

  handleProjectPress = (key: string) => {
    this.setState({ isProjectModalVisible: false, projectKey: key });
  };

  handleProjectRemovePress = () => {
    this.setState({ isProjectModalVisible: false, projectKey: undefined });
  };

  handleDateChange = (date: Date) => {
    const startTimestamp = new Date(this.state.startTimestamp).setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    const endTimestamp = new Date(this.state.endTimestamp).setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

    this.setState({ startTimestamp, endTimestamp });
  };

  handleStartAtChange = (time: Date) => {
    this.setState({
      startTimestamp: time.getTime(),
      finishedAtError: undefined,
    });
  };

  handleFinishedAtChange = (time: Date) => {
    this.setState({
      endTimestamp: time.getTime(),
      finishedAtError: undefined,
    });
  };

  handleCompletedAtChange = (time: Date) => {
    this.setState({ startTimestamp: time.getTime(), endTimestamp: time.getTime() });
  };

  handleDeletePress = () => {
    const { onDelete, timetableEntry } = this.props;

    if (timetableEntry == null) throw new Error('Timetable entry cannot be null on the edit form.');

    Alert.alert(
      'Delete Entry?',
      'This timetable entry will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Entry',
          onPress: () => onDelete?.(timetableEntry),
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };

  render() {
    const {
      startTimestamp, endTimestamp, goalId, isSelectedGoalTimeTracked,
      finishedAtError, isProjectModalVisible, projectKey,
    } = this.state;
    const { allGoals, projects } = this.props;
    const goalItems = allGoals.map(goal => ({ key: goal.id, value: goal.title }));
    const project = projects?.find(project => project.key === projectKey);

    return (
      <>
        <ScrollView style={styles.container} alwaysBounceVertical={false}>
          {!this.isGoalDeleted() && (
            <ItemInput title='Goal' itemKey={goalId} allItems={goalItems} onItemChange={this.handleGoalChange} />
          )}
          <InputContainer title='Project' value={project?.title ?? '[Tap to select]'}
                          onPress={this.toggleProjectModal} />
          <DateInput title='Date' date={new Date(startTimestamp)} onDateChange={this.handleDateChange} />
          {isSelectedGoalTimeTracked && (
            <>
              <TimeInput title='Started at' time={new Date(startTimestamp)} onTimeChange={this.handleStartAtChange} />
              <TimeInput title='Finished at' time={new Date(endTimestamp)}
                         onTimeChange={this.handleFinishedAtChange} error={finishedAtError} />
            </>
          )}
          {!isSelectedGoalTimeTracked && (
            <TimeInput title='Completed at' time={new Date(startTimestamp)}
                       onTimeChange={this.handleCompletedAtChange} />
          )}

          {!this.isAddNewForm() && (
            <View style={styles.deleteButtonContainer}>
              <TextButton title='Delete Entry' onPress={this.handleDeletePress} />
            </View>
          )}
        </ScrollView>
        <ProjectModal
          projects={projects}
          isVisible={isProjectModalVisible}
          allProjectTitles={projects.map(project => project.title)}
          onProjectModalHideRequest={this.toggleProjectModal}
          onProjectRemovePress={this.handleProjectRemovePress}
          onProjectPress={this.handleProjectPress}
          onProjectCreatePress={this.handleProjectCreatePress}
        />
      </>
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
