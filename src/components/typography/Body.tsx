import React, { FunctionComponent } from 'react'
import { StyleSheet, Text } from 'react-native'

export const Body: FunctionComponent = ({ children }) => {
  return <Text style={styles.body}>{children}</Text>
};

const styles = StyleSheet.create({
  body: {
    color: '#fff',
    fontFamily: 'NunitoSans-Regular',
    fontSize: 14,
    fontWeight: '600',
  },
});