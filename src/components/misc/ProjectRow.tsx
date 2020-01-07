import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';
import { formatDurationInMs } from '../../utilities';

interface ProjectRowProps {
  id: string;
  title: string;
  totalTimeSpentInMs: number;
}

export const ProjectRow: FunctionComponent<ProjectRowProps> = ({ title, totalTimeSpentInMs }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      <View>
        <Text style={styles.timeSpent}>
          {formatDurationInMs(totalTimeSpentInMs)}
        </Text>
        <Text style={styles.totalText}>TOTAL</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  timeSpent: {
    textAlign: 'right',
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  totalText: {
    textAlign: 'right',
    color: colors.gray,
    fontFamily: fonts.semibold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
