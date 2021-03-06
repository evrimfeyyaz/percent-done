import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { ScrollablePicker } from './ScrollablePicker';
import { isLocale24Hours } from '../../utilities';
import { colors, fonts } from '../../theme';

interface TimePickerProps {
  initialValue: Date;
  onValueChange?: (value: Date) => void;
}

export const TimePicker: FunctionComponent<TimePickerProps> = ({ initialValue, onValueChange }) => {
  const [time, setTime] = useState(new Date(initialValue.getTime()));

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

    onValueChange?.(new Date(newTimeStamp));
  };

  const handleMinuteIndexChange = (index: number) => {
    const newTimeStamp = time.setMinutes(index);
    setTime(new Date(newTimeStamp));

    onValueChange?.(new Date(newTimeStamp));
  };

  const handlePeriodIndexChange = (index: number) => {
    const currentHour = time.getHours();
    let newHour = currentHour;

    if (index === 1 && currentHour < 12) { // PM
      newHour += 12;
    }

    if (index === 0 && currentHour > 11) { // AM
      newHour -= 12;
    }

    const newTimeStamp = time.setHours(newHour);
    setTime(new Date(newTimeStamp));

    onValueChange?.(new Date(newTimeStamp));
  };

  let hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  if (is24Hours) hours = hours.concat([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
  const hourData = hours.map(hour => ({ key: `hour-${hour.toString()}`, value: hour.toString() }));

  const minutes = [];
  for (let i = 0; i < 60; i++) minutes.push(i);
  const minuteData = minutes.map(min => ({ key: `min-${min.toString()}`, value: min.toString().padStart(2, '0') }));

  const periods = ['AM', 'PM'];
  const periodData = periods.map(period => ({ key: period, value: period }));

  let minutePickerStyle: ViewStyle | undefined;
  if (!is24Hours) {
    minutePickerStyle = { width: 45, flex: 0 };
  }

  return (
    <View style={styles.container}>
      <ScrollablePicker data={hourData} index={hourIndex} onIndexChange={handleHourIndexChange} />
      <Text style={styles.colon}>:</Text>
      <ScrollablePicker data={minuteData} index={minuteIndex} onIndexChange={handleMinuteIndexChange}
                        alignment='start' style={minutePickerStyle} />
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
  },
  colon: {
    fontFamily: fonts.regular,
    fontSize: 24,
    marginTop: -4,
    color: colors.gray,
  },
});
