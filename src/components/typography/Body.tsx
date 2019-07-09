import React, { FunctionComponent } from 'react'
import { StyleSheet, Text } from 'react-native'
import { colors, fonts } from '../theme';

export const Body: FunctionComponent = ({ children }) => {
  return <Text style={styles.body}>{children}</Text>
};

const styles = StyleSheet.create({
  body: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});