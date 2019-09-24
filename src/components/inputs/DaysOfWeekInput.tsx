import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableNativeFeedback, LayoutChangeEvent,
} from 'react-native';
import { colors, fonts } from '../../theme';

export enum DayOfWeek {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday'
}

export type WeekDaysArray = ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[];

interface DaysOfWeekInputProps {
  title: string;
  selectedDays: DayOfWeek[] | WeekDaysArray;
  onDaysChange?: (days: (DayOfWeek[] | WeekDaysArray)) => void;
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const DaysOfWeekInput: FunctionComponent<DaysOfWeekInputProps> = ({ title, selectedDays, onDaysChange, onLayout, error }) => {
  const handleDayChange = (changedDay: DayOfWeek) => {
    let newSelectedDays = [...selectedDays];

    if (selectedDays.includes(changedDay)) {
      newSelectedDays = newSelectedDays.filter(day => day !== changedDay);
    } else {
      newSelectedDays.push(changedDay);
    }

    if (onDaysChange != null) onDaysChange(newSelectedDays);
  };

  const dayButton = (day: DayOfWeek) => {
    const selectedStyle = { opacity: 1 };
    const isSelected = selectedDays.includes(day);
    const dayButtonStyle = isSelected
      ? StyleSheet.flatten([styles.dayButton, selectedStyle])
      : styles.dayButton;

    return (
      <TouchableWithoutFeedback
        key={`${day}-${isSelected ? 'selected' : 'unselected'}`}
        onPress={() => handleDayChange(day)}
      >
        <View style={dayButtonStyle}>
          <Text style={styles.dayButtonTitle}>{day.toString().charAt(0)}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const dayButtons: Element[] = [];
  for (let day in DayOfWeek) {
    if (isNaN(Number(day))) {
      dayButtons.push(dayButton(DayOfWeek[day] as DayOfWeek));
    }
  }

  return (
    <InputContainer
      title={title}
      opacityOnTouch={false}
      contentStyle={styles.inputContainer}
      error={error}
      onLayout={onLayout}
    >
      <View style={styles.dayButtonsContainer}>{dayButtons}</View>
    </InputContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 8,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  dayButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginBottom: 22,
  },
  dayButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: colors.orange,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  dayButtonTitle: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
});
