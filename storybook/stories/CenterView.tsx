import React, { FunctionComponent, ReactChild } from 'react'
import { StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const CenterView: FunctionComponent<{ children?: ReactChild }> = ({ children = null }) => {
  return <LinearGradient colors={['#23212C', '#3E4353']} style={styles.main}>{children}</LinearGradient>;
};
export default CenterView;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});