import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import {
  BackgroundView,
  ColorInput,
  DaysOfWeekInput, DurationInput,
  Section,
  SwitchInput,
  TextInput, TimeInput,
} from '../components';

export const AddGoalScreen: NavigationScreenComponent = () => {
  const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [title, setTitle] = useState('');
  const [timeTracking, setTimeTracking] = useState(false);
  const [duration, setDuration] = useState({ hours: 1, minutes: 0 });
  const [recurring, setRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState(allDays);
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());

  const handleTitleChange = (text: string) => {
    setTitle(text);
  };

  const handleTimeTrackingChange = (value: boolean) => {
    setTimeTracking(value);
  };

  const handleDurationChange = (hours: number, minutes: number) => {
    setDuration({ hours, minutes });
  };

  const handleRecurringChange = (value: boolean) => {
    setRecurring(value);
  };

  const handleRecurringDaysChange = (days: string[]) => {
    setRecurringDays(days);
  };

  const handleReminderChange = (value: boolean) => {
    setReminder(value);
  };

  const handleReminderTimeChange = (time: Date) => {
    setReminderTime(time);
  };

  return (
    <BackgroundView style={styles.container}>
      <ScrollView>
        <View style={styles.goalInputContainer}>
          <TextInput placeholder='What is your goal?' onChangeText={handleTitleChange} value={title} />
        </View>

        <Section title='Time Tracking' bottomSeparator={false}>
          <SwitchInput title='Time tracking' value={timeTracking} onValueChange={handleTimeTrackingChange} />
          {timeTracking && <DurationInput duration={duration} onDurationChange={handleDurationChange} />}
        </Section>

        <Section title='Recurring' bottomSeparator={false}>
          <SwitchInput title='Recurring' value={recurring} onValueChange={handleRecurringChange} />
          {recurring && <DaysOfWeekInput selectedDays={recurringDays} onDaysChange={handleRecurringDaysChange} />}
        </Section>

        <Section title='Reminder' bottomSeparator={false}>
          <SwitchInput title='Reminder' value={reminder} onValueChange={handleReminderChange} />
          {reminder && <TimeInput time={reminderTime} onTimeChange={handleReminderTimeChange} />}
        </Section>

        <Section title='Color' bottomSeparator={false}>
          {/*<ColorInput />*/}
        </Section>
      </ScrollView>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
  goalInputContainer: {
    marginBottom: 40,
  },
});
