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
import _ from 'lodash';

interface DaysOfWeekInputProps {
  title: string;
  selectedDays: boolean[];
  onDaysChange?: (days: boolean[]) => void;
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const dayInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const DaysOfWeekInput: FunctionComponent<DaysOfWeekInputProps> = ({ title, selectedDays, onDaysChange, onLayout, error }) => {
  const handleDayChange = (changedDay: number) => {
    const newSelectedDays = _.clone(selectedDays);
    newSelectedDays[changedDay] = !newSelectedDays[changedDay];

    onDaysChange?.(newSelectedDays);
  };

  const dayButton = (day: number) => {
    const selectedStyle = { opacity: 1 };
    const isSelected = selectedDays[day];
    const dayButtonStyle = isSelected
      ? [styles.dayButton, selectedStyle]
      : styles.dayButton;

    return (
      <TouchableWithoutFeedback
        key={`${day}-${isSelected ? 'selected' : 'unselected'}`}
        onPress={() => handleDayChange(day)}
      >
        <View style={dayButtonStyle}>
          <Text style={styles.dayButtonTitle}>{dayInitials[day]}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const dayButtons: Element[] = [];
  for (let day = 0; day < 7; day++) {
    dayButtons.push(dayButton(day));
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
