import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextButton } from '..';
import RBSheet from 'react-native-raw-bottom-sheet';
import { colors, fonts } from '../../theme';

interface BottomSheetProps {
  onCancelPress: () => void;
  onDonePress: () => void;
}

export class BottomSheet extends Component<BottomSheetProps> {
  private readonly rbSheetRef: React.RefObject<any>;

  constructor(props: BottomSheetProps) {
    super(props);
    this.rbSheetRef = React.createRef();
  }

  open() {
    if (this.rbSheetRef != null && this.rbSheetRef.current != null) this.rbSheetRef.current.open();
  }

  close() {
    if (this.rbSheetRef != null && this.rbSheetRef.current != null) this.rbSheetRef.current.close();
  }

  render() {
    const { children, onCancelPress, onDonePress } = this.props;

    return (
      <RBSheet ref={this.rbSheetRef} height={250} duration={200} animationType='fade'
               customStyles={{ container: styles.container }}>
        <View>
          <View style={styles.buttonsContainer}>
            <TextButton title='Cancel' onPress={onCancelPress} style={styles.cancelButton} />
            <TextButton title='Done' onPress={onDonePress} style={styles.doneButton} />
          </View>
          <View style={styles.buttonsSeparator} />
        </View>

        {children}
      </RBSheet>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  buttonsContainer: {
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
  buttonsSeparator: {
    borderBottomColor: colors.lightGray,
    width: '100%',
    borderBottomWidth: 1,
  },
});
