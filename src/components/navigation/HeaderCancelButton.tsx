import React, { FunctionComponent } from 'react';
import { HeaderButton } from '..';
import {
  GestureResponderEvent,
  Image,
  Platform, StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Icons } from '../../../assets';

interface HeaderCancelButtonProps {
  onPress: (event: GestureResponderEvent) => void;
}

export const HeaderCancelButton: FunctionComponent<HeaderCancelButtonProps> = ({ onPress }) => {
  if (Platform.OS === 'ios') {
    return <HeaderButton title='Cancel' onPress={onPress} />;
  } else {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Image source={Icons.headerCancel} style={styles.androidCancelButton} />
      </TouchableWithoutFeedback>
    );
  }
};

const styles = StyleSheet.create({
  androidCancelButton: {
    marginHorizontal: 15,
  },
});
