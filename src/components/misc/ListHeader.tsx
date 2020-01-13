import React, { FunctionComponent, useState } from 'react';
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import { Button, TextButton } from '..';
import { colors, textStyles } from '../../theme';
import Modal from 'react-native-modal';

interface ListHeaderProps {
  description?: string;
  descriptionButtonTitle?: string;
  buttonTitle?: string;
  buttonIconSource?: any;
  onButtonPress?: (event: GestureResponderEvent) => void;
}

export const ListHeader: FunctionComponent<ListHeaderProps> = ({
                                                                 description, descriptionButtonTitle,
                                                                 onButtonPress, buttonTitle, buttonIconSource,
                                                               }) => {
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);

  const toggleDescriptionModal = () => {
    setIsDescriptionModalVisible(!isDescriptionModalVisible);
  };

  return (
    <View style={styles.container}>
      {buttonTitle && (
        <Button title={buttonTitle} style={styles.button} iconSource={buttonIconSource}
                onPress={onButtonPress} />
      )}
      {descriptionButtonTitle && (
        <TextButton
          title={descriptionButtonTitle}
          onPress={toggleDescriptionModal}
          style={styles.descriptionButton}
        />
      )}
      <Modal isVisible={isDescriptionModalVisible}
             onBackdropPress={toggleDescriptionModal}
             onBackButtonPress={toggleDescriptionModal}
             animationIn='fadeIn'
             animationOut='fadeOut'
      >
        <View style={styles.modalContainer}>
          <Text style={[textStyles.body, styles.description]}>
            {description}
          </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionButton: {
    marginTop: 10,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  description: {
    textAlign: 'center',
    color: colors.black,
  },
  button: {
    width: 200,
    marginBottom: 20,
  },
});
