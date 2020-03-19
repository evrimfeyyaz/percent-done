import React, { FunctionComponent } from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, fonts } from '../../theme';

interface ButtonProps {
  /**
   * Title of the button.
   */
  title: string;
  color?: string;
  titleColor?: string;
  /**
   * Icon for the button. Should be white and 24x24.
   */
  iconSource?: ImageSourcePropType;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
}

/**
 * A styled button component.
 */
export const Button: FunctionComponent<ButtonProps> = ({
                                                         title,
                                                         iconSource = null,
                                                         color = colors.orange,
                                                         titleColor = colors.white,
                                                         disabled = false,
                                                         onPress,
                                                         style,
                                                       }) => {
  let icon = null;
  if (iconSource != null) {
    icon = <Image source={iconSource} style={styles.icon} />;
  }

  const colorStyle = {
    backgroundColor: color,
  };

  const titleColorStyle = {
    color: titleColor,
  };

  return (
    <TouchableOpacity style={[styles.container, colorStyle, style]} onPress={onPress} disabled={disabled}>
      {icon}
      <Text style={[styles.title, titleColorStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    height: 45,
    borderRadius: 4,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  icon: {
    height: 24,
    width: 24,
    marginEnd: 6,
    marginTop: -1,
  },
});
