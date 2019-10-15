import React, { Component, createRef } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import {
  ColorInput,
  DaysOfWeekInput,
  DurationInput,
  Section,
  SwitchInput,
  TextInput,
  TimeInput,
} from '..';
import { goalColors } from '../../theme';
import { Goal } from '../../store/goals/types';
import { createRandomId } from '../../utilities';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface GoalFormState {
  title: string;
  color: string;
  isTimeTracked: boolean;
  duration: { hours: number, minutes: number };
  recurringDays: string[];
  reminder: boolean;
  reminderTime: Date;
  /**
   * Y position of the title input.
   */
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

export interface GoalFormProps {
  onSubmit: (goal: Goal) => void;
}

export class GoalForm extends Component<GoalFormProps, GoalFormState> {
  private readonly scrollViewRef: React.RefObject<KeyboardAwareScrollView>;

  constructor(props: GoalFormProps) {
    super(props);

    this.state = {
      title: '',
      isTimeTracked: false,
      duration: { hours: 1, minutes: 0 },
      recurringDays: allDays,
      reminder: false,
      reminderTime: new Date(),
      color: goalColors[0],
    };
    this.scrollViewRef = createRef<KeyboardAwareScrollView>();
  }

  validate(): boolean {
    const { title, recurringDays, titleInputPosition, recurringDaysInputPosition } = this.state;
    let validates = true;
    let titleInputError = this.state.titleInputError;
    let recurringDaysInputError = this.state.recurringDaysInputError;
    let failedInputPositions = [];

    if (title == null || title.trim().length === 0) {
      titleInputError = 'You need to enter a title.';
      if (titleInputPosition != null) failedInputPositions.push(titleInputPosition);
      validates = false;
    }

    if (recurringDays.length === 0) {
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

    const { title, isTimeTracked, duration, recurringDays, reminder, reminderTime, color } = this.state;

    const durationInSeconds = isTimeTracked ? duration.hours * 60 * 60 + duration.minutes * 60 : undefined;
    const id = createRandomId();

    const goal: Goal = {
      id,
      title,
      color,
      durationInSeconds,
      recurringDays,
      reminderTime: (reminder ? reminderTime : undefined),
    };

    this.props.onSubmit(goal);

    return true;
  }

  handleTitleChange = (title: string) => {
    this.setState({
      title,
      titleInputError: undefined,
    });
  };

  handleTimeTrackingChange = (timeTracking: boolean) => {
    this.setState({ isTimeTracked: timeTracking });
  };

  handleDurationChange = (hours: number, minutes: number) => {
    this.setState({ duration: { hours, minutes } });
  };

  handleRecurringDaysChange = (recurringDays: string[]) => {
    this.setState({
      recurringDays,
      recurringDaysInputError: undefined,
    });
  };

  handleReminderChange = (reminder: boolean) => {
    this.setState({ reminder });
  };

  handleReminderTimeChange = (reminderTime: Date) => {
    this.setState({ reminderTime });
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

  render() {
    const {
      title, isTimeTracked, duration, recurringDays,
      reminder, reminderTime, color, titleInputError, recurringDaysInputError,
    } = this.state;

    return (
      <KeyboardAwareScrollView style={styles.container} ref={this.scrollViewRef} keyboardDismissMode='on-drag'
        // @ts-ignore
                               keyboardOpeningTime={100} scrollToOverflowEnabled={true}>
        <View style={styles.topInputGroup}>
          <TextInput placeholder='What is your goal?' onChangeText={this.handleTitleChange} value={title}
                     onLayout={this.handleTitleInputLayout} error={titleInputError} />
          <DaysOfWeekInput title='Repeat on following days' selectedDays={recurringDays}
                           onLayout={this.handleRecurringDaysInputLayout}
                           error={recurringDaysInputError}
                           onDaysChange={this.handleRecurringDaysChange} />
        </View>

        <Section title='Time Tracking' bottomSeparator={false} contentStyle={styles.sectionContent}>
          <SwitchInput title='Track your time?' value={isTimeTracked} onValueChange={this.handleTimeTrackingChange} />
          {isTimeTracked && <DurationInput duration={duration} onDurationChange={this.handleDurationChange} />}
        </Section>

        <Section title='Reminder' bottomSeparator={false} contentStyle={styles.sectionContent}>
          <SwitchInput title='Set a reminder?' value={reminder} onValueChange={this.handleReminderChange} />
          {reminder && <TimeInput time={reminderTime} onTimeChange={this.handleReminderTimeChange} />}
        </Section>

        <Section title='Color' bottomSeparator={false} contentStyle={styles.sectionContent}>
          <ColorInput colors={goalColors} selectedColor={color} onColorChange={this.handleColorChange} />
        </Section>
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
});
