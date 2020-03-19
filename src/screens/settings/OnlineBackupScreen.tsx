import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { BackgroundView, OnlineBackup, SignIn } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../store/types';
import { User } from '../../store/settings/types';
import { withConnectionCheck } from '../../components/misc/withConnectionCheck';
import { signInWithEmailLink } from '../../store/settings/thunks';

export const OnlineBackupScreen: NavigationStackScreenComponent = withConnectionCheck(({ navigation }) => {
  const dispatch = useDispatch();

  const user = useSelector<StoreState, User | undefined>(state => state.settings.user);

  function handlePrivacyPolicyPress() {
    navigation.navigate('PrivacyPolicy');
  }

  function handleTermsOfUsePress() {
    navigation.navigate('TermsOfUse');
  }

  function handleSendSignInLinkPress(email: string) {
    dispatch(signInWithEmailLink(email));
  }

  return (
    <BackgroundView>
      {user && (
        <OnlineBackup userEmail={user.email} />
      )}
      {!user && (
        <SignIn
          onPrivacyPolicyPress={handlePrivacyPolicyPress}
          onTermsOfUsePress={handleTermsOfUsePress}
          onSendSignInLinkPress={handleSendSignInLinkPress}
        />
      )}
    </BackgroundView>
  );
});

OnlineBackupScreen.navigationOptions = {
  title: 'Online Backup',
};
