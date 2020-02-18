import React from 'react';
import { BackgroundView, LicenseData, Licenses } from '../../components';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const LicensesScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const handleLibraryPress = (license: LicenseData) => {
    navigation.navigate('License', { license });
  };

  return (
    <BackgroundView>
      <Licenses
        onLibraryPress={handleLibraryPress}
      />
    </BackgroundView>
  );
};

LicensesScreen.navigationOptions = {
  title: 'Licenses',
};
