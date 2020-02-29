import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { BackgroundView, TextOnlyPage } from '../../components';

export const TermsOfUseScreen: NavigationStackScreenComponent = () => {
  const termsOfUse = `
  Percent Done is created by Evrim Persembe.

  By using Percent Done, you agree to all the terms set forth here and the Privacy Policy located at https://percent-done.evrim.io/terms, along with any revisions of it.
  
  Percent Done is provided “as is” and without any warranties.
  
  We reserve the right to make changes to these terms.
  `;

  return (
    <BackgroundView>
      <TextOnlyPage text={termsOfUse} />
    </BackgroundView>
  );
};

TermsOfUseScreen.navigationOptions = {
  title: 'Terms of Use',
};
