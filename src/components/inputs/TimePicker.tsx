import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScrollablePicker } from './ScrollablePicker';
import { isLocale24Hours } from '../../utilities';
import { colors, fonts } from '../../theme';

interface TimePickerProps {
  initialTime: Date;
  onTimeChange?: (date: Date) => void;
}

export const TimePicker: FunctionComponent<TimePickerProps> = ({ initialTime, onTimeChange }) => {
  const [time, setTime] = useState(new Date(initialTime.getTime()));

  const is24Hours = isLocale24Hours();
  const hour = time.getHours();
  const periodIndex = hour < 12 ? 0 : 1;
  const hourIndex = getHourIndexFromHour(hour);
  const minuteIndex = time.getMinutes();

  function getHourIndexFromHour(hour: number) {
    return is24Hours ? hour : (hour - 1 + 12) % 12;
  }

  function getHourFromHourIndex(index: number) {
    if (is24Hours) {
      return index;
    } else if (periodIndex === 0) {
      return (index + 1) % 12;
    } else {
      return ((index + 1) % 12 + 12);
    }
  }

  const handleHourIndexChange = (index: number) => {
    let newHour = getHourFromHourIndex(index);

    const newTimeStamp = time.setHours(newHour);
    setTime(new Date(newTimeStamp));

    if (onTimeChange != null) onTimeChange(new Date(newTimeStamp));
  };

  const handleMinuteIndexChange = (index: number) => {
    const newTimeStamp = time.setMinutes(index);
    setTime(new Date(newTimeStamp));

    if (onTimeChange != null) onTimeChange(new Date(newTimeStamp));
  };

  const handlePeriodIndexChange = (index: number) => {
    let newHour = time.getHours();

    if (index === 1) { // PM
      newHour += 12;
    } else {
      newHour -= 12;
    }

    const newTimeStamp = time.setHours(newHour);
    setTime(new Date(newTimeStamp));

    if (onTimeChange != null) onTimeChange(new Date(newTimeStamp));
  };

  let hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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
    color: colors.gray,
  },
});
