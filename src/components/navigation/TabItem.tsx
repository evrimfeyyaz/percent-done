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
  const activeContainerStyle = active ? styles.containerActive : null;

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.container, activeContainerStyle, style])}
      onPress={handlePress}
      disabled={active}
      ref={ref}
    >
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0)'
  },
  containerActive: {
    borderBottomColor: colors.blue,
  },
  title: {
    fontFamily: fonts.regular,
    color: colors.gray,
    fontSize: 20,
    textTransform: 'uppercase',
    width: '100%'
  },
  titleActive: {
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
