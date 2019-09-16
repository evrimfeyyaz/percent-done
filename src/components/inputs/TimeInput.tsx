import React, { FunctionComponent, SyntheticEvent, useRef, useState } from 'react';
import { InputContainer } from './InputContainer';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, StyleSheet, View } from 'react-native';
import { TextButton } from './TextButton';
import { colors, fonts } from '../../theme';

interface TimeInputProps {
  mode?: 'time' | 'duration';
  time?: Date;
  onTimeChange?: (time: Date) => void;
}

export const TimeInput: FunctionComponent<TimeInputProps> = ({
                                                               mode = 'time',
                                                               time = new Date(),
                                                               onTimeChange,
                                                             }) => {
    const bottomSheetRef = useRef<RBSheet>(null);
    /**
     *  Keep the previous time, just in case the user cancels the bottom sheet.
     *  Only used on iOS.
     */
    const [prevTime, setPrevTime] = useState(time);
    const [showAndroidPicker, setShowAndroidPicker] = useState(false);

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

    const handleTimeChange = (event: SyntheticEvent<{ timestamp: number }>, date?: Date) => {
      console.log(event.currentTarget.timestamp);
      console.log(date);
      if (onTimeChange != null && date != null) onTimeChange(date);
      if (Platform.OS === 'android') setShowAndroidPicker(false);
    };

    const handleInputContainerPress = () => {
      if (Platform.OS === 'ios') {
        showBottomSheet();
      } else if (Platform.OS === 'android') {
        setShowAndroidPicker(true);
      }
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

    const is24Hour = mode === 'duration'; // This is a bit of hack. If the mode is 'duration', we show a
                                          // 24 hour clock to imitate a duration picker on Android. iOS
                                          // does have a dedicated countdown picker.
    const androidPicker = showAndroidPicker ? (
      <DateTimePicker mode='time' value={time} onChange={handleTimeChange} display='spinner' is24Hour={is24Hour} />
    ) : null;


    const iosMode = mode === 'time' ? 'time' : 'countdown';
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
        <DateTimePicker mode={iosMode} value={time} onChange={handleTimeChange}
                        style={styles.picker} />
      </RBSheet>
    );

    const picker = Platform.OS === 'ios' ? iosPicker : androidPicker;
    const value = mode === 'time' ? moment(time).format('LT') : moment(time).format('H[h] m[m]');
    const title = mode === 'time' ? 'Time' : 'Duration';

    return (
      <InputContainer
        title={title}
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
