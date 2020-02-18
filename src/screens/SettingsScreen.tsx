import React from 'react';
import { BackgroundView, Settings } from '../components';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const SettingsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleTutorialPress = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <BackgroundView>
      <Settings
        onTutorialPress={handleTutorialPress}
      />
    </BackgroundView>
  );
};

SettingsScreen.navigationOptions = {
  title: 'Settings',
};
