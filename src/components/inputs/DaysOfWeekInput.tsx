import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableNativeFeedback,
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

interface DaysOfWeekInputProps {
  selectedDays: DayOfWeek[] | string[];
  onDaysChange?: (days: (DayOfWeek[] | string[])) => void;
}

export const DaysOfWeekInput: FunctionComponent<DaysOfWeekInputProps> = ({ selectedDays, onDaysChange }) => {
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
      title="Days of the week"
      opacityOnTouch={false}
      style={styles.inputContainer}
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
