import React from 'react';
import { BackgroundView, License, LicenseData } from '../../components';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const LicenseScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const license = navigation.getParam('license') as LicenseData;

  return (
    <BackgroundView>
      <License
        repository={license.repository}
        licenseUrl={license.licenseUrl}
        licenses={license.licenses}
      />
    </BackgroundView>
  );
};

LicenseScreen.navigationOptions = ({ navigation }) => {
  const { library } = navigation.getParam('license') as LicenseData;

  return {
    title: library,
  };
};
