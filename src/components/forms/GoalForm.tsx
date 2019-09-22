import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ColorInput,
  DaysOfWeekInput,
  DurationInput,
  Section,
  SwitchInput,
  TextInput,
  TimeInput,
  WeekDaysArray,
} from '..';
import { goalColors } from '../../theme';
import { Goal } from '../../store/goals/types';

const allDays: WeekDaysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface GoalFormState {
  title: string;
  color: string;
  isTimeTracked: boolean;
  duration: { hours: number, minutes: number };
  recurringDays: WeekDaysArray;
  reminder: boolean;
  reminderTime: Date;
}

export interface GoalFormProps {
  onSubmit: (goal: Goal) => void;
}

export class GoalForm extends Component<GoalFormProps, GoalFormState> {
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
  }

  submit() {
    const { title, isTimeTracked, duration, recurringDays, reminder, reminderTime, color } = this.state;

    const durationInSeconds = isTimeTracked ? duration.hours * 60 * 60 + duration.minutes * 60 : undefined;

    const goal: Goal = {
      title,
      color,
      durationInSeconds,
      recurringDays,
      reminderTime: (reminder ? reminderTime : undefined),
    };

    this.props.onSubmit(goal);
  }

  handleTitleChange = (title: string) => {
    this.setState({ title });
  };

  handleTimeTrackingChange = (timeTracking: boolean) => {
    this.setState({ isTimeTracked: timeTracking });
  };

  handleDurationChange = (hours: number, minutes: number) => {
    this.setState({ duration: { hours, minutes } });
  };

  handleRecurringDaysChange = (recurringDays: WeekDaysArray) => {
    this.setState({ recurringDays });
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

  render() {
    const { title, isTimeTracked, duration, recurringDays, reminder, reminderTime, color } = this.state;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.topInputGroup}>
          <TextInput placeholder='What is your goal?' onChangeText={this.handleTitleChange} value={title} />
          <DaysOfWeekInput title='Repeat on following days' selectedDays={recurringDays}
                           onDaysChange={this.handleRecurringDaysChange} />
        </View>

        <Section title='Time Tracking' bottomSeparator={false}>
          <SwitchInput title='Track your time?' value={isTimeTracked} onValueChange={this.handleTimeTrackingChange} />
          {isTimeTracked && <DurationInput duration={duration} onDurationChange={this.handleDurationChange} />}
        </Section>

        <Section title='Reminder' bottomSeparator={false}>
          <SwitchInput title='Set a reminder?' value={reminder} onValueChange={this.handleReminderChange} />
          {reminder && <TimeInput time={reminderTime} onTimeChange={this.handleReminderTimeChange} />}
        </Section>

        <Section title='Color' bottomSeparator={false}>
          <ColorInput colors={goalColors} selectedColor={color} onColorChange={this.handleColorChange} />
        </Section>
      </ScrollView>
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
});
