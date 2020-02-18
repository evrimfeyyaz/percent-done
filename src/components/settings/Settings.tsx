import React, { FunctionComponent } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { MenuLink } from '../index';

interface SettingsProps {
  onAboutPress?: () => void;
  onTutorialPress?: () => void;
  onLicensesPress?: () => void;
}

export const Settings: FunctionComponent<SettingsProps> = ({
                                                             onAboutPress, onTutorialPress, onLicensesPress,
                                                           }) => {
  const about = {
    title: 'About',
    key: 'about',
    onPress: onAboutPress,
  };

  const licenses = {
    title: 'Licenses',
    key: 'licenses',
    onPress: onLicensesPress,
  };

  const tutorial = {
    title: 'Tutorial',
    key: 'tutorial',
    onPress: onTutorialPress,
  };

  const sections = [
    {
      data: [tutorial],
    },
    {
      data: [licenses, about],
    },
  ];

  return (
    <SectionList
      alwaysBounceVertical={false}
      style={styles.container}
      sections={sections}
      renderItem={item => <MenuLink title={item.item.title} onPress={item.item.onPress} />}
      renderSectionHeader={() => <View style={styles.sectionHeader} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  sectionHeader: {
    height: 30,
  },
});
