import React, { FunctionComponent } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { InputContainer } from '..';

export interface LicenseProps {
  licenses: string,
  repository: string,
  licenseUrl: string,
}

export const License: FunctionComponent<LicenseProps> = ({ licenses, repository, licenseUrl }) => {
  const handleRepositoryPress = () => {
    Linking.openURL(repository);
  };

  const handleLicenseTermsPress = () => {
    Linking.openURL(licenseUrl);
  };

  return (
    <View style={styles.container}>
      {licenses && <InputContainer title='Licenses' value={licenses} opacityOnTouch={false} />}
      {repository && <InputContainer title='Repository' value='Open in Browser' onPress={handleRepositoryPress} />}
      {licenseUrl && <InputContainer title='License Terms' value='Open in Browser' onPress={handleLicenseTermsPress} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    flex: 1,
    alignSelf: 'stretch',
  },
});
