import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { BackgroundView, TextOnlyPage } from '../../components';

export const PrivacyPolicyScreen: NavigationStackScreenComponent = () => {
  const privacyPolicy = `
We do not knowingly collect any information from you, as Percent Done is an offline app.

Percent Done does not utilize any ad network or analytics tool.

Percent Done uses many open-source libraries to provide certain features within the app. To our knowledge, none of these libraries connect to any third-party server.

If you follow any of the links within Percent Done, it is your responsibility to check the privacy policy of the links you followed.

If we decide to make changes to this privacy policy, all changes will be posted at https://percent-done.evrim.io/privacy-policy.

By using Percent Done, you consent to this privacy policy.
  `;

  return (
    <BackgroundView>
      <TextOnlyPage text={privacyPolicy} />
    </BackgroundView>
  );
};

PrivacyPolicyScreen.navigationOptions = {
  title: 'Privacy Policy',
};
