import React, { FunctionComponent } from 'react';
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../../assets';

interface BackgroundViewProps {
  style?: ViewStyle;
}

export const BackgroundView: FunctionComponent<BackgroundViewProps> = ({ style, children }) => {
  return (
    <LinearGradient
      colors={['#23212C', '#3E4353']}
      style={[styles.gradientContainer, style]}
    >
      <ImageBackground
        style={styles.imageContainer}
        source={Images.bg}
        resizeMode={'repeat'}
      />
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: 'cover',
    opacity: 0.17,
  },
  gradientContainer: {
    flex: 1,
  },
});
