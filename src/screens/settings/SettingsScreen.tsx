import React from 'react';
import { BackgroundView, Settings } from '../../components';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const SettingsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleTutorialPress = () => {
    navigation.navigate('Onboarding');
  };

  const handleAboutPress = () => {
    navigation.navigate('About');
  };

  const handleLicensesPress = () => {
    navigation.navigate('Licenses');
  };

  return (
    <BackgroundView>
      <Settings
        onTutorialPress={handleTutorialPress}
        onAboutPress={handleAboutPress}
        onLicensesPress={handleLicensesPress}
      />
    </BackgroundView>
  );
};

SettingsScreen.navigationOptions = {
  title: 'Settings',
};
