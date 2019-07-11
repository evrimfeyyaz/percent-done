import React, { FunctionComponent } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../theme';

interface ButtonProps {
  /**
   * Title of the button.
   */
  title: string,
  /**
   * Icon for the button. Should be white and 24x24.
   */
  iconSource?: ImageSourcePropType,
}

/**
 * A styled button component.
 */
export const Button: FunctionComponent<ButtonProps> = ({ title, iconSource = null }) => {
  let icon = null;
  if (iconSource != null) {
    icon = <Image source={iconSource} style={styles.icon} />;
  }

  return (
    <TouchableOpacity style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange,
    paddingHorizontal: 40,
    height: 45,
    borderRadius: 4,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.white,
  },
  icon: {
    height: 24,
    width: 24,
    marginEnd: 6,
    marginTop: -1,
  },
});