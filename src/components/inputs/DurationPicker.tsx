import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollablePicker } from './ScrollablePicker';

interface DurationPickerProps {
  value: { hours: number, minutes: number }
  onDurationChange?: (hours: number, minutes: number) => void;
}

export const DurationPicker: FunctionComponent<DurationPickerProps> = ({ value, onDurationChange }) => {
  const handleHoursChange = (index: number) => {
    if (onDurationChange != null) onDurationChange(index, value.minutes);
  };

  const handleMinutesChange = (index: number) => {
    if (onDurationChange != null) onDurationChange(value.hours, index);
  };

  const hours = [];
  for (let i = 0; i < 24; i++) hours.push(i);
  const hourData = hours.map(hour => ({ key: `hour-${hour.toString()}`, value: hour.toString() }));

  const minutes = [];
  for (let i = 0; i < 60; i++) minutes.push(i);
  const minuteData = minutes.map(min => ({ key: `min-${min.toString()}`, value: min.toString().padStart(2, '0') }));

  return (
    <View style={styles.container}>
      <ScrollablePicker data={hourData} index={value.hours} style={styles.picker}
                        onIndexChange={handleHoursChange} text='H' />
      <ScrollablePicker data={minuteData} index={value.minutes} style={styles.picker}
                        onIndexChange={handleMinutesChange} text='M' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    paddingHorizontal: 30,
  },
  picker: {
    marginHorizontal: 10,
  },
});
