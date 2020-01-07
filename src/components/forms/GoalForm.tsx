import React, { Component, createRef } from 'react';
import { Alert, LayoutAnimation, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import {
  ColorInput,
  DaysOfWeekInput,
  DurationInput,
  Section,
  SwitchInput, TextButton,
  TextInput,
} from '..';
import { goalColors } from '../../theme';
import { Goal } from '../../store/goals/types';
import { createRandomId } from '../../utilities';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export interface GoalFormProps {
  onSubmit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  goal?: Goal;
  allGoalTitles: string[];
}

interface GoalFormState {
  title: string;
  color: string;
  isTimeTracked: boolean;
  duration: { hours: number, minutes: number };
  recurringDays: boolean[];
  titleInputPosition?: number;
  titleInputError?: string;
  /**
   * Y position of the recurring days input.
   */
  recurringDaysInputPosition?: number;
  recurringDaysInputError?: string;
  /**
   * Y positions of all inputs that failed validation.
   */
  failedInputPositions?: number[];
}

export class GoalForm extends Component<GoalFormProps, GoalFormState> {
  private readonly scrollViewRef = createRef<KeyboardAwareScrollView>();

  state: GoalFormState = {
    title: this.props.goal?.title || '',
    isTimeTracked: false,
    duration: { hours: 1, minutes: 0 },
    recurringDays: new Array(7).fill(true),
    color: this.props.goal?.color || goalColors[0],
  };

  validate(): boolean {
    const { title, recurringDays, titleInputPosition, recurringDaysInputPosition } = this.state;
    const { allGoalTitles } = this.props;
    let validates = true;
    let titleInputError = this.state.titleInputError;
    let recurringDaysInputError = this.state.recurringDaysInputError;
    let failedInputPositions = [];

    if (title == null || title.trim().length === 0) {
      titleInputError = 'You need to enter a title.';
      if (titleInputPosition != null) failedInputPositions.push(titleInputPosition);
      validates = false;
    }

    if (allGoalTitles.some(existingTitle => existingTitle.toLowerCase() === title.toLowerCase())) {
      titleInputError = 'Another goal with this title already exists.';
      if (titleInputPosition != null) failedInputPositions.push(titleInputPosition);
      validates = false;
    }

    if (recurringDays.indexOf(true) === -1) {
      recurringDaysInputError = 'You should select at least one day.';
      if (recurringDaysInputPosition != null) failedInputPositions.push(recurringDaysInputPosition);
      validates = false;
    }

    this.setState({ titleInputError, recurringDaysInputError, failedInputPositions });

    return validates;
  }

  componentDidUpdate(prevProps: Readonly<GoalFormProps>, prevState: Readonly<GoalFormState>, snapshot?: any): void {
    const failedInputPositions = this.state.failedInputPositions;
    let topFailedInput;
    if (failedInputPositions != null && failedInputPositions.length > 0) {
      topFailedInput = Math.min(...failedInputPositions);
    }

    if (topFailedInput != null && this.scrollViewRef != null && this.scrollViewRef.current != null) {
      this.scrollViewRef.current.scrollToPosition(0, topFailedInput, true);
      this.setState({ failedInputPositions: undefined });
    }
  }

  /**
   * Submits the form, and returns `true` if the submission is successful,
   * and `false` otherwise.
   */
  submit(): boolean {
    if (!this.validate()) {
      return false;
    }

    let { title, isTimeTracked, duration, recurringDays, color } = this.state;
    let durationInMs: number | undefined;
    let id: string;
    let createdAt: Date;

    if (this.isAddNewForm()) {
      durationInMs = isTimeTracked ? duration.hours * 60 * 60 * 1000 + duration.minutes * 60 * 1000 : undefined;
      id = createRandomId();
      createdAt = new Date();
    } else {
      const { goal } = this.props;
      if (goal == null) throw new Error('Goal cannot be null on the edit form.');

      id = goal.id;
      durationInMs = goal.durationInMs;
      createdAt = goal.createdAt;
    }

    const goal: Goal = {
      id,
      title,
      color,
      durationInMs,
      recurringDays,
      createdAt,
    };

    this.props.onSubmit?.(goal);

    return true;
  }

  handleTitleChange = (title: string) => {
    this.setState({
      title,
      titleInputError: undefined,
    });
  };

  handleTimeTrackingChange = (timeTracking: boolean) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isTimeTracked: timeTracking });
  };

  handleDurationChange = (duration: { hours: number, minutes: number }) => {
    this.setState({ duration });
  };

  handleRecurringDaysChange = (recurringDays: boolean[]) => {
    this.setState({
      recurringDays,
      recurringDaysInputError: undefined,
    });
  };

  handleColorChange = (color: string) => {
    this.setState({ color });
  };

  handleTitleInputLayout = (event: LayoutChangeEvent) => {
    this.setState({
      titleInputPosition: event.nativeEvent.layout.y,
    });
  };

  handleRecurringDaysInputLayout = (event: LayoutChangeEvent) => {
    this.setState({
      recurringDaysInputPosition: event.nativeEvent.layout.y,
    });
  };

  handleDeletePress = () => {
    const { onDelete, goal } = this.props;

    if (goal == null) throw new Error('Goal cannot be null on the edit form.');

    Alert.alert(
      'Delete Goal?',
      'This goal will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Goal', onPress: () => onDelete?.(goal.id), style: 'destructive' },
      ],
      { cancelable: true },
    );
  };

  /**
   * Returns `true` when this form is an "add new goal" form, and `false`
   * when it is an "edit goal' form.
   */
  private isAddNewForm = () => {
    return this.props.goal == null;
  };

  render() {
    const {
      title, isTimeTracked, duration, recurringDays,
      color, titleInputError, recurringDaysInputError,
    } = this.state;

    return (
      <KeyboardAwareScrollView style={styles.container} ref={this.scrollViewRef} keyboardDismissMode='on-drag'
        // @ts-ignore
                               keyboardOpeningTime={100} scrollToOverflowEnabled={true}>
        <View style={styles.topInputGroup}>
          <TextInput placeholder='What is your goal?' onChangeText={this.handleTitleChange} value={title}
                     onLayout={this.handleTitleInputLayout} error={titleInputError} />
          {this.isAddNewForm() && (
            <DaysOfWeekInput title='Repeat on following days' selectedDays={recurringDays}
                             onLayout={this.handleRecurringDaysInputLayout}
                             error={recurringDaysInputError}
                             onDaysChange={this.handleRecurringDaysChange} />
          )}
        </View>

        {this.isAddNewForm() && (
          <Section title='Time Tracking' bottomSeparator={false} contentStyle={styles.sectionContent}>
            <SwitchInput title='Track your time?' value={isTimeTracked} onValueChange={this.handleTimeTrackingChange} />
            {isTimeTracked && <DurationInput duration={duration} onDurationChange={this.handleDurationChange} />}
          </Section>
        )}

        <Section title='Color' bottomSeparator={false} contentStyle={styles.sectionContent}>
          <ColorInput colors={goalColors} selectedColor={color} onColorChange={this.handleColorChange} />
        </Section>

        {!this.isAddNewForm() && (
          <View style={styles.deleteButtonContainer}>
            <TextButton title='Delete Goal' onPress={this.handleDeletePress} />
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
  topInputGroup: {
    marginBottom: 40,
  },
  sectionContent: {
    paddingStart: 40,
    paddingEnd: 0,
  },
  deleteButtonContainer: {
    marginTop: -10,
    alignItems: 'center',
  },
});
