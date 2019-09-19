import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import {
  BackgroundView,
  ColorInput,
  DaysOfWeekInput, DurationInput,
  Section,
  SwitchInput,
  TextInput,
  TimeInput,
} from '../components';

export const AddGoalScreen: NavigationScreenComponent = () => {
  const [title, setTitle] = useState('');
  const [timeTracking, setTimeTracking] = useState(false);
  const [duration, setDuration] = useState({ hours: 1, minutes: 0 });
  const [recurring, setRecurring] = useState(false);
  const [reminder, setReminder] = useState(false);

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

  const handleReminderChange = (value: boolean) => {
    setReminder(value);
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
          {recurring && <DaysOfWeekInput />}
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
