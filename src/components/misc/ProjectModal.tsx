import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { SelectBox } from '..';
import Modal from 'react-native-modal';

interface ProjectModalProps {
  projects: { key: string; title: string }[];
  isVisible: boolean;
  onProjectPress?: (key: string) => void;
  onProjectCreatePress?: (title: string) => void;
  onProjectRemovePress?: () => void;
  onProjectModalHideRequest?: () => void;
}

export const ProjectModal: FunctionComponent<ProjectModalProps> = ({
                                                                     projects,
                                                                     isVisible,
                                                                     onProjectPress,
                                                                     onProjectCreatePress,
                                                                     onProjectRemovePress,
                                                                     onProjectModalHideRequest,
                                                                   }) => {
  return (
    <Modal isVisible={isVisible} animationIn='fadeIn' animationOut='fadeOut'
           avoidKeyboard onBackButtonPress={onProjectModalHideRequest} onBackdropPress={onProjectModalHideRequest}>
      <View style={styles.container}>
        <SelectBox data={projects} cancelButtonTitle='Track Without Project' onItemPress={onProjectPress}
                   onCreatePress={onProjectCreatePress} onCancelPress={onProjectRemovePress} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: '50%',
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
});
