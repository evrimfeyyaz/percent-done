import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollablePicker } from './ScrollablePicker';
import { useEffectAfterInitialRender } from '../../utilities/useEffectAfterInitialRender';

interface DurationPickerProps {
  initialValue?: { hours: number, minutes: number }
  onDurationChange?: (hours: number, minutes: number) => void;
}

export const DurationPicker: FunctionComponent<DurationPickerProps> = ({
                                                                         initialValue = {
                                                                           hours: 1,
                                                                           minutes: 0,
                                                                         }, onDurationChange,
                                                                       }) => {
  const [selectedHours, setSelectedHours] = useState(initialValue.hours);
  const [selectedMinutes, setSelectedMinutes] = useState(initialValue.minutes);

  useEffectAfterInitialRender(() => {
    if (onDurationChange != null) onDurationChange(selectedHours, selectedMinutes);
  }, [selectedHours, selectedMinutes]);

  const handleHoursChange = (index: number) => setSelectedHours(index);
  const handleMinutesChange = (index: number) => setSelectedMinutes(index);

  const hours = [];
  for (let i = 0; i < 24; i++) hours.push(i);
  const hourData = hours.map(hour => ({ key: `hour-${hour.toString()}`, value: hour.toString() }));

  const minutes = [];
  for (let i = 0; i < 60; i++) minutes.push(i);
  const minuteData = minutes.map(min => ({ key: `min-${min.toString()}`, value: min.toString().padStart(2, '0') }));

  return (
    <View style={styles.container}>
      <ScrollablePicker data={hourData} index={selectedHours} style={styles.picker}
                        onIndexChange={handleHoursChange} text='H' />
      <ScrollablePicker data={minuteData} index={selectedMinutes} style={styles.picker}
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
