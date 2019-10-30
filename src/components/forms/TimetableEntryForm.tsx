import React, { FunctionComponent } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MenuLink, TimeInput } from '..';
import { StyleSheet } from 'react-native';

export const TimetableEntryForm: FunctionComponent = () => {
  return (
    <KeyboardAwareScrollView style={styles.container} keyboardDismissMode='on-drag'>
      <MenuLink title='Goal' />
      <TimeInput title='Started at' time={new Date()} />
      <TimeInput title='Finished at' time={new Date()} />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
