import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
} from 'react-native';
import { colors, fonts } from '../../theme';

interface DaysOfWeekInputProps {
  title: string;
  selectedDays: string[];
  onDaysChange?: (days: string[]) => void;
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const DaysOfWeekInput: FunctionComponent<DaysOfWeekInputProps> = ({ title, selectedDays, onDaysChange, onLayout, error }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleDayChange = (changedDay: string) => {
    let newSelectedDays = [...selectedDays];

    if (selectedDays.includes(changedDay)) {
      newSelectedDays = newSelectedDays.filter(day => day !== changedDay);
    } else {
      newSelectedDays.push(changedDay);
    }

    onDaysChange?.(newSelectedDays);
  };

  const dayButton = (day: string) => {
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
  days.forEach((day: string) => dayButtons.push(dayButton(day)));

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
