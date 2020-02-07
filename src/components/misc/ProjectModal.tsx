import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { SelectBox } from '..';
import Modal from 'react-native-modal';

interface ProjectModalProps {
  projects: { key: string; title: string }[];
  isVisible: boolean;
  allProjectTitles: string[];
  onProjectPress?: (key: string) => void;
  onProjectCreatePress?: (title: string) => void;
  onProjectRemovePress?: () => void;
  onProjectModalHideRequest?: () => void;
}

export const ProjectModal: FunctionComponent<ProjectModalProps> = ({
                                                                     projects,
                                                                     isVisible,
                                                                     allProjectTitles,
                                                                     onProjectPress,
                                                                     onProjectCreatePress,
                                                                     onProjectRemovePress,
                                                                     onProjectModalHideRequest,
                                                                   }) => {
  const handleProjectCreatePress = (title: string) => {
    if (allProjectTitles.includes(title)) return;

    onProjectCreatePress?.(title);
  };

  return (
    <Modal isVisible={isVisible} animationIn='fadeIn' animationOut='fadeOut'
           avoidKeyboard onBackButtonPress={onProjectModalHideRequest} onBackdropPress={onProjectModalHideRequest}>
      <View style={styles.container}>
        <SelectBox data={projects} cancelButtonTitle='Track Without Project' onItemPress={onProjectPress}
                   onCreatePress={handleProjectCreatePress} onCancelPress={onProjectRemovePress} />
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
