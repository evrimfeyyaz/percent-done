import React, { FunctionComponent } from 'react';
import { Text, ScrollView, View, StyleSheet } from 'react-native';
import { Button, TextButton } from '..';
import { colors, textStyles } from '../../theme';
import { momentWithDeviceLocale } from '../../utilities';

interface OnlineBackupProps {
  lastBackupDate?: Date;
  userEmail: string;
}

export const OnlineBackup: FunctionComponent<OnlineBackupProps> = ({ lastBackupDate, userEmail }) => {
  const backUpDateString = lastBackupDate ? momentWithDeviceLocale(lastBackupDate).format('lll') : 'No Backup Yet';

  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      <Text style={[textStyles.info, styles.text]}>Last Backup</Text>
      <Text style={[textStyles.body, styles.text, styles.infoText]}>{backUpDateString}</Text>
      <Button title='Back Up Now' style={styles.button} />

      <View style={styles.horizontalLine} />

      <Text style={[textStyles.info, styles.text]}>Signed In As</Text>
      <Text style={[textStyles.body, styles.text, styles.infoText]}>{userEmail}</Text>
      <Button title='Sign Out' style={styles.button} />
      <Button title='Change E-Mail' style={[styles.button, styles.secondaryButton]} titleColor={colors.black} />
      <Button title='Change Password' style={[styles.button, styles.secondaryButton]} titleColor={colors.black} />
      <TextButton title='Delete Account' style={[styles.button, styles.deleteButton]} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: 30,
    flexGrow: 1,
  },
  horizontalLine: {
    alignSelf: 'stretch',
    backgroundColor: colors.gray,
    height: 1,
    marginVertical: 30,
  },
  button: {
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: colors.white,
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  deleteButton: {
    marginTop: 30,
    color: colors.lightRed,
    textAlign: 'center',
  },
  infoText: {
    marginBottom: 10,
  },
});
