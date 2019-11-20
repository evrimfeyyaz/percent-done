import React, { Component } from 'react';
import { DateInput, ItemInput, TextButton, TimeInput } from '..';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { TimetableEntry } from '../../store/timetableEntries/types';
import { Goal } from '../../store/goals/types';
import { isTimeTracked } from '../../store/goals/utilities';
import { createRandomId, msToHoursMinutesSeconds } from '../../utilities';

interface TimetableEntryFormState {
  goalId: string;
  startTimestamp: number;
  endTimestamp: number;
  isSelectedGoalTimeTracked: boolean;
  finishedAtError?: string;
}

export interface TimetableEntryFormProps {
  allGoals: Goal[];
  goalId: string;
  onSubmit?: (timetableEntry: TimetableEntry) => void;
  onDelete?: (timetableEntryId: string) => void;
  timetableEntry?: TimetableEntry;
}

// TODO: Refactor this form together with the goal form to make it DRY.
export class TimetableEntryForm extends Component<TimetableEntryFormProps, TimetableEntryFormState> {
  constructor(props: TimetableEntryFormProps) {
    super(props);

    this.state = {
      goalId: props.goalId,
      startTimestamp: Date.now(),
      endTimestamp: Date.now(),
      isSelectedGoalTimeTracked: false,
    };
  }

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

    let { goalId, startTimestamp, endTimestamp } = this.state;
    let id: string;

    if (this.isAddNewForm()) {
      id = createRandomId();
    } else {
      const { timetableEntry } = this.props;
      if (timetableEntry == null) throw new Error('Timetable entry cannot be null on the edit form.');

      id = timetableEntry.id;
    }

    const timetableEntry: TimetableEntry = {
      startTimestamp,
      endTimestamp,
      goalId,
      id,
    };

    this.props.onSubmit?.(timetableEntry);

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
        { text: 'Delete Entry', onPress: () => onDelete?.(timetableEntry.id), style: 'destructive' },
      ],
      { cancelable: true },
    );
  };

  render() {
    const { startTimestamp, endTimestamp, goalId, isSelectedGoalTimeTracked, finishedAtError } = this.state;
    const { allGoals } = this.props;
    const goalItems = allGoals.map(goal => ({ key: goal.id, value: goal.title }));

    return (
      <ScrollView style={styles.container}>
        <ItemInput title='Goal' itemKey={goalId} allItems={goalItems} onItemChange={this.handleGoalChange} />
        <DateInput title='Date' date={new Date(startTimestamp)} onDateChange={this.handleDateChange} />
        {isSelectedGoalTimeTracked && (
          <>
            <TimeInput title='Started at' time={new Date(startTimestamp)} onTimeChange={this.handleStartAtChange} />
            <TimeInput title='Finished at' time={new Date(endTimestamp)}
                       onTimeChange={this.handleFinishedAtChange} error={finishedAtError} />
          </>
        )}
        {!isSelectedGoalTimeTracked && (
          <TimeInput title='Completed at' time={new Date(startTimestamp)} onTimeChange={this.handleCompletedAtChange} />
        )}

        {!this.isAddNewForm() && (
          <View style={styles.deleteButtonContainer}>
            <TextButton title='Delete Goal' onPress={this.handleDeletePress} />
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  deleteButtonContainer: {
    marginTop: -10,
    alignItems: 'center',
  },
});
