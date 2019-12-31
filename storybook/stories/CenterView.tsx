import React, { FunctionComponent, ReactChild } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CenterView: FunctionComponent<{ children?: ReactChild }> = ({
                                                                    children = null,
                                                                  }) => {
  return (
    <LinearGradient colors={['#23212C', '#3E4353']} style={styles.main}>
      <View style={styles.scrollView}>
        {children}
      </View>
    </LinearGradient>
  );
};
export default CenterView;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignSelf: 'stretch',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
