import React, { FunctionComponent, ReactChild } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CenterView: FunctionComponent<{ children?: ReactChild }> = ({
                                                                    children = null,
                                                                  }) => {
  return (
    <LinearGradient colors={['#23212C', '#3E4353']} style={styles.main}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {children}
      </ScrollView>
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
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
});
