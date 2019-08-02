import React, {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, fonts } from '../../theme';

interface TabItemProps {
  title: string;
  active?: boolean;
  onPress?: (title: string) => void;
  style?: ViewStyle;
}

export const TabItem: ForwardRefExoticComponent<PropsWithoutRef<TabItemProps> & RefAttributes<TouchableOpacity>> = forwardRef(({ title, active = false, onPress, style }, ref) => {
  const handlePress = () => {
    if (onPress != null) {
      onPress(title);
    }
  };

  const titleStyle = active
    ? StyleSheet.flatten([styles.title, styles.titleActive])
    : styles.title;
  const containerStyle = active ? styles.containerActive : null;

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([containerStyle, style])}
      onPress={handlePress}
      disabled={active}
      ref={ref}
    >
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  containerActive: {
    borderBottomColor: colors.blue,
    borderBottomWidth: 2,
  },
  title: {
    fontFamily: fonts.regular,
    color: colors.gray,
    fontSize: 20,
    textTransform: 'uppercase',
  },
  titleActive: {
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
