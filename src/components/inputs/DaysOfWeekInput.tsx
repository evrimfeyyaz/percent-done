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
    const isSelected = selectedDays[day];

    const selectedButtonStyle = {
      backgroundColor: colors.orange,
    };
    const dayButtonStyle = isSelected
      ? [styles.dayButton, selectedButtonStyle]
      : styles.dayButton;

    const selectedButtonTitleStyle = {
      color: colors.white,
    };
    const dayButtonTitleStyle = isSelected
      ? [styles.dayButtonTitle, selectedButtonTitleStyle]
      : styles.dayButtonTitle;

    return (
      <TouchableWithoutFeedback
        key={`${day}-${isSelected ? 'selected' : 'unselected'}`}
        onPress={() => handleDayChange(day)}
      >
        <View style={dayButtonStyle}>
          <Text style={dayButtonTitleStyle}>{dayInitials[day]}</Text>
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
    backgroundColor: colors.darkGray,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonTitle: {
    color: colors.offBlack,
    fontFamily: fonts.semibold,
    fontSize: 12,
    marginRight: -StyleSheet.hairlineWidth,
    marginBottom: -2,
  },
});
