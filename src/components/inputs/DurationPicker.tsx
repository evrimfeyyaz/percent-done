import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollablePicker } from './ScrollablePicker';
import _ from 'lodash';

interface DurationPickerProps {
  initialValue: { hours: number, minutes: number }
  onValueChange?: ({ hours, minutes }: { hours: number, minutes: number }) => void;
}

export const DurationPicker: FunctionComponent<DurationPickerProps> = ({ initialValue, onValueChange }) => {
  const [duration, setDuration] = useState(_.clone(initialValue));

  const handleHoursChange = (index: number) => {
    setDuration({ hours: index, minutes: duration.minutes });
    onValueChange?.({ hours: index, minutes: duration.minutes });
  };

  const handleMinutesChange = (index: number) => {
    setDuration({ hours: duration.hours, minutes: index });
    onValueChange?.({ hours: duration.hours, minutes: index });
  };

  const hours = [];
  for (let i = 0; i < 24; i++) hours.push(i);
  const hourData = hours.map(hour => ({ key: `hour-${hour.toString()}`, value: hour.toString() }));

  const minutes = [];
  for (let i = 0; i < 60; i++) minutes.push(i);
  const minuteData = minutes.map(min => ({ key: `min-${min.toString()}`, value: min.toString().padStart(2, '0') }));

  return (
    <View style={styles.container}>
      <ScrollablePicker data={hourData} index={duration.hours} style={styles.picker}
                        onIndexChange={handleHoursChange} text='H' />
      <ScrollablePicker data={minuteData} index={duration.minutes} style={styles.picker}
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
