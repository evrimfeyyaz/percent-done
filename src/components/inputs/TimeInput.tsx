import React, { FunctionComponent, SyntheticEvent, useRef, useState } from 'react';
import { InputContainer } from './InputContainer';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import { Platform, StyleSheet, View } from 'react-native';
import { TextButton } from './TextButton';
import { colors, fonts } from '../../theme';
import { TimePicker } from './TimePicker';

interface TimeInputProps {
  time?: Date;
  onTimeChange?: (time: Date) => void;
}

export const TimeInput: FunctionComponent<TimeInputProps> = ({
                                                               time = new Date(),
                                                               onTimeChange,
                                                             }) => {
    const bottomSheetRef = useRef<RBSheet>(null);
    /**
     *  Keep the previous time, just in case the user cancels the bottom sheet.
     *  Only used on iOS.
     */
    const [prevTime, setPrevTime] = useState(time);

    const showBottomSheet = () => {
      setPrevTime(time);
      if (bottomSheetRef != null && bottomSheetRef.current != null) {
        bottomSheetRef.current.open();
      }
    };

    const hideBottomSheet = () => {
      if (bottomSheetRef != null && bottomSheetRef.current != null) {
        bottomSheetRef.current.close();
      }
    };

    const handleTimeChange = (date: Date) => {
      if (onTimeChange != null && date != null) onTimeChange(date);
    };

    const handleInputContainerPress = () => {
      showBottomSheet();
    };

    const handleCancelButtonPress = () => {
      // Reverse changes.
      if (onTimeChange != null && prevTime != null && time.getTime() !== prevTime.getTime()) {
        onTimeChange(prevTime);
      }

      hideBottomSheet();
    };

    const handleDoneButtonPress = () => {
      hideBottomSheet();
    };

    const picker = (
      <RBSheet ref={bottomSheetRef} height={250} duration={200} animationType='fade'
               customStyles={{ container: styles.bottomSheetContainer }}>
        <View>
          <View style={styles.bottomSheetButtonsContainer}>
            <TextButton title='Cancel' onPress={handleCancelButtonPress} style={styles.cancelButton} />
            <TextButton title='Done' onPress={handleDoneButtonPress} style={styles.doneButton} />
          </View>
          <View style={styles.bottomSheetButtonsSeparator} />
        </View>
        <TimePicker onTimeChange={handleTimeChange} />
      </RBSheet>
    );

    const value = moment(time).format('LT');

    return (
      <InputContainer
        title='Time'
        value={value}
        opacityOnTouch={false}
        onPress={handleInputContainerPress}
      >
        {picker}
      </InputContainer>
    );
  }
;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    paddingBottom: 40,
  },
  bottomSheetButtonsContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.gray,
  },
  doneButton: {
    fontSize: 16,
    color: colors.blue,
    fontFamily: fonts.bold,
  },
  bottomSheetButtonsSeparator: {
    borderBottomColor: colors.lightGray,
    width: '100%',
    borderBottomWidth: 1,
  },
  picker: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});
