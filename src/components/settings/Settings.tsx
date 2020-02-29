import React, { FunctionComponent } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { MenuLink } from '..';

interface SettingsProps {
  onAboutPress?: () => void;
  onTutorialPress?: () => void;
  onLicensesPress?: () => void;
  onTermsOfUsePress?: () => void;
  onPrivacyPolicyPress?: () => void;
}

export const Settings: FunctionComponent<SettingsProps> = ({
                                                             onAboutPress, onTutorialPress, onLicensesPress,
                                                             onTermsOfUsePress, onPrivacyPolicyPress,
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

  const termsOfUse = {
    title: 'Terms of Use',
    key: 'terms-of-use',
    onPress: onTermsOfUsePress,
  };

  const privacyPolicy = {
    title: 'Privacy Policy',
    key: 'privacy-policy',
    onPress: onPrivacyPolicyPress,
  };

  const sections = [
    {
      data: [tutorial],
    },
    {
      data: [licenses, termsOfUse, privacyPolicy, about],
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
