import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

interface TabItemProps {
  title: string,
  active?: boolean,
}

export const TabItem: FunctionComponent<TabItemProps> = ({ title, active = false }) => {
  const titleStyle = active ? StyleSheet.flatten([styles.title, styles.titleActive]) : styles.title;

  return (
    <View style={active ? styles.containerActive : null}>
      <Text style={titleStyle}>{title}</Text>
    </View>
  );
};

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