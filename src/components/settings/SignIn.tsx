import React, { FunctionComponent, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { colors, textStyles } from '../../theme';
import { Button, TextButton, TextInput } from '..';

interface SignInProps {
  onTermsOfUsePress?: () => void;
  onPrivacyPolicyPress?: () => void;
  onSendSignInLinkPress?: (email: string) => void;
}

export const SignIn: FunctionComponent<SignInProps> = ({
                                                         onTermsOfUsePress, onPrivacyPolicyPress,
                                                         onSendSignInLinkPress,
                                                       }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState();

  function handleEmailChange(text: string) {
    setEmailError(undefined);
    setEmail(text);
  }

  function handleSendSignInLinkPress() {
    const isValid = validateEmail();

    if (!isValid) {
      setEmailError('Please enter a valid e-mail address.');
      return;
    }

    onSendSignInLinkPress?.(email);
  }

  function validateEmail() {
    const emailRegex = /^\S+@\S+\.\S+$/;

    return email.match(emailRegex) != null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} alwaysBounceVertical={false}>
      <Text style={[textStyles.body, styles.topInfo]}>
        Percent Done can regularly back up your data online to prevent data loss. If you would like to use this feature,
        enter your e-mail address below to receive a sign in link.
      </Text>

      <View style={styles.inputContainer}>
        <TextInput placeholder='E-Mail' textContentType='emailAddress' autoFocus value={email}
                   onChangeText={handleEmailChange} error={emailError} />
      </View>
      <Button title='Send Sign-In Link' style={styles.button} onPress={handleSendSignInLinkPress} />

      <View style={styles.infoContainer}>
        <TextButton title='Terms of Use' onPress={onTermsOfUsePress} />
        <Text style={textStyles.body}>   –   </Text>
        <TextButton title='Privacy Policy' onPress={onPrivacyPolicyPress} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  contentContainer: {
    paddingVertical: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 10,
    marginHorizontal: 20,
  },
  signUpButton: {
    backgroundColor: colors.offWhite,
  },
  forgotButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  infoContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    opacity: .7,
  },
  topInfo: {
    marginHorizontal: 20,
    marginBottom: 40,
    marginTop: 20,
    textAlign: 'center',
  },
});
