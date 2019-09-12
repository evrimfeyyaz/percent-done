import React, { FunctionComponent, SyntheticEvent, useRef, useState } from 'react';
import { InputContainer } from './InputContainer';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, StyleSheet, View } from 'react-native';
import { TextButton } from './TextButton';
import { colors, fonts } from '../../theme';

interface TimeInputProps {
  time?: Date;
  onTimeChange?: (time: Date) => void;
}

export const TimeInput: FunctionComponent<TimeInputProps> = ({
                                                               time = new Date(),
                                                               onTimeChange,
                                                             }) => {
    const parsedTime = moment(time, ['h:m', 'h:m a']);
    const bottomSheetRef = useRef<RBSheet>(null);
    const [tempTime, setTempTime] = useState(time);
    const [showAndroidPicker, setShowAndroidPicker] = useState(false);

    const showBottomSheet = () => {
      if (bottomSheetRef != null && bottomSheetRef.current != null) {
        bottomSheetRef.current.open();
      }
    };

    const hideBottomSheet = () => {
      if (bottomSheetRef != null && bottomSheetRef.current != null) {
        bottomSheetRef.current.close();
      }
    };

    const handleTemporaryTimeChange = (event: SyntheticEvent<{ timestamp: number }>, date?: Date) => {
      if (date != null) setTempTime(date);
    };

    const handleTimeChange = (event: SyntheticEvent<{ timestamp: number }>, date?: Date) => {
      if (date != null && time.getTime() != date.getTime()) {
        if (onTimeChange != null) onTimeChange(tempTime);
      }
      setShowAndroidPicker(false);
    };

    const handleInputContainerPress = () => {
      if (Platform.OS === 'ios') {
        showBottomSheet();
      } else if (Platform.OS === 'android') {
        setShowAndroidPicker(true);
      }
    };

    const handleCancelButtonPress = () => {
      setTempTime(time);
      hideBottomSheet();
    };

    const handleDoneButtonPress = () => {
      if (time.getTime() != tempTime.getTime()) {
        if (onTimeChange != null) onTimeChange(tempTime);
      }

      hideBottomSheet();
    };

    const androidPicker = showAndroidPicker ? (
      <DateTimePicker mode='time' value={time} onChange={handleTimeChange} />
    ) : null;

    const iosPicker = (
      <RBSheet ref={bottomSheetRef} height={250} duration={200} animationType='fade'
               customStyles={{ container: styles.bottomSheetContainer }}>
        <View>
          <View style={styles.bottomSheetButtonsContainer}>
            <TextButton title='Cancel' onPress={handleCancelButtonPress} style={styles.cancelButton} />
            <TextButton title='Done' onPress={handleDoneButtonPress} style={styles.doneButton} />
          </View>
          <View style={styles.bottomSheetButtonsSeparator} />
        </View>
        <DateTimePicker mode='time' value={tempTime} onChange={handleTemporaryTimeChange} style={styles.picker} />
      </RBSheet>
    );

    const picker = Platform.OS === 'ios' ? iosPicker : androidPicker;

    return (
      <InputContainer
        title="Time"
        value={parsedTime.format('LT')}
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
