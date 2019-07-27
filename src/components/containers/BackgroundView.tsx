import React, { FunctionComponent } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../../assets';

export const BackgroundView: FunctionComponent = ({ children }) => {
  return (
    <LinearGradient colors={['#23212C', '#3E4353']} style={styles.gradientContainer}>
      <ImageBackground style={styles.imageContainer}
                       source={Images.bg}
                       resizeMode={'repeat'}>
      </ImageBackground>
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
    opacity: .17,
  },
  gradientContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});