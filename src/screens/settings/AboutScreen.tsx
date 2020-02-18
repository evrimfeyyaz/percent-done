import React from 'react';
import { BackgroundView, About } from '../../components';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const AboutScreen: NavigationStackScreenComponent = () => {
  return (
    <BackgroundView>
      <About />
    </BackgroundView>
  );
};

AboutScreen.navigationOptions = {
  title: 'About',
};
