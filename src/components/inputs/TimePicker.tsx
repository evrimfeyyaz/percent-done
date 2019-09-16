import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScrollablePicker } from './ScrollablePicker';
import { isLocale24Hours } from '../../utilities';
import { colors, fonts } from '../../theme';

interface TimePickerProps {
  initialValue?: Date;
  onTimeChange?: (date: Date) => void;
}

export const TimePicker: FunctionComponent<TimePickerProps> = ({ initialValue = new Date(), onTimeChange }) => {
  const is24Hours = isLocale24Hours();

  const currentHour = initialValue.getHours();
  const [periodIndex, setPeriodIndex] = useState(currentHour < 12 ? 0 : 1);
  const [hourIndex, setHourIndex] = useState(is24Hours ? currentHour : (currentHour) % 12);
  const [minuteIndex, setMinuteIndex] = useState(initialValue.getMinutes());

  useEffect(() => {
    let time = new Date();

    let hours = hourIndex;
    if (!is24Hours && periodIndex === 1) hours += 12;

    time = new Date(time.setHours(hours, minuteIndex));

    if (onTimeChange != null) onTimeChange(time);
  }, [periodIndex, hourIndex, minuteIndex]);

  const handleHourIndexChange = (index: number) => setHourIndex(index);
  const handleMinuteIndexChange = (index: number) => setMinuteIndex(index);
  const handlePeriodIndexChange = (index: number) => setPeriodIndex(index);

  let hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  if (is24Hours) hours = hours.concat([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
  const hourData = hours.map(hour => ({ key: `hour-${hour.toString()}`, value: hour.toString() }));

  const minutes = [];
  for (let i = 0; i < 60; i++) minutes.push(i);
  const minuteData = minutes.map(min => ({ key: `min-${min.toString()}`, value: min.toString().padStart(2, '0') }));

  const periods = ['AM', 'PM'];
  const periodData = periods.map(period => ({ key: period, value: period }));

  return (
    <View style={styles.container}>
      <ScrollablePicker data={hourData} index={hourIndex} style={styles.picker}
                        onIndexChange={handleHourIndexChange} />
      <Text style={styles.colon}>:</Text>
      <ScrollablePicker data={minuteData} index={minuteIndex} style={styles.picker}
                        onIndexChange={handleMinuteIndexChange} />
      {!is24Hours && (
        <ScrollablePicker index={periodIndex} data={periodData} alignment='start'
                          onIndexChange={handlePeriodIndexChange} />
      )}
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
  colon: {
    fontFamily: fonts.regular,
    fontSize: 24,
    marginTop: -4,
    marginEnd: -6,
    color: colors.orange,
  },
});
