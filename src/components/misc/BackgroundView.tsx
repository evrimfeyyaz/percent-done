import React, { FunctionComponent } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface BackgroundViewProps {
  style?: ViewStyle;
}

export const BackgroundView: FunctionComponent<BackgroundViewProps> = ({ style, children }) => {
  return (
    <LinearGradient
      colors={['#23212C', '#3E4353']}
      style={[styles.gradientContainer, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'repeat',
    backgroundColor: 'red',
    opacity: 0.17,
  },
  gradientContainer: {
    flex: 1,
    position: 'relative',
  },
});
