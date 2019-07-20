import React, { FunctionComponent } from 'react';
import { Text, ImageSourcePropType, View, Image, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

interface AchievementProps {
  title: string,
  iconSource: ImageSourcePropType,
  done?: boolean,
}

export const Achievement: FunctionComponent<AchievementProps> = ({ title, iconSource, done = false }) => {
  const achievementStyle = {
    opacity: done ? 1 : .3,
  };

  return (
    <View style={StyleSheet.flatten([styles.container, achievementStyle])}>
      <View style={styles.iconContainer}>
        <Image source={iconSource} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 90,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  iconContainer: {
    backgroundColor: colors.yellow,
    width: 50,
    height: 50,
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
});