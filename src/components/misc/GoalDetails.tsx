import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, DurationInfo } from '..';
import { Icons } from '../../../assets';
import { pluralize } from '../../utilities';
import { colors, fonts, textStyles } from '../../theme';

export interface GoalDetailsProps {
  title: string;
  isTracked: boolean;
  chainLength: number;
  totalCompletedMs?: number;
  isCompleted?: boolean;
  onTrackOrCompleteButtonPress?: () => void;
  onEditButtonPress?: () => void;
}

export const GoalDetails: FunctionComponent<GoalDetailsProps> = ({
                                                                   title, isTracked, chainLength,
                                                                   totalCompletedMs, isCompleted,
                                                                   onTrackOrCompleteButtonPress,
                                                                 }) => {
  const buttonTitle = isTracked ? 'Track Goal' : (isCompleted ? 'Mark as Incomplete' : 'Mark as Completed');
  const buttonIconSource = isTracked ? Icons.stopwatch : (isCompleted ? Icons.undo : Icons.checkmarkLarge);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {isTracked && totalCompletedMs != null && (
        <View style={styles.timeTrackedContainer}>
          <Text style={styles.infoTitle}>Total Tracked Time</Text>
          <DurationInfo durationInMs={totalCompletedMs} />
        </View>
      )}

      <Text style={styles.infoTitle}>Current Streak</Text>
      <Text style={textStyles.info}>{chainLength}&nbsp;
        <Text style={textStyles.infoLabel}>{pluralize('day', chainLength)}</Text>
      </Text>

      <Button title={buttonTitle} iconSource={buttonIconSource} onPress={onTrackOrCompleteButtonPress}
              style={styles.trackOrCompleteButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 28,
    color: colors.white,
    marginBottom: 20,
  },
  trackOrCompleteButton: {
    alignSelf: 'stretch',
    marginTop: 40,
  },
  infoTitle: {
    fontFamily: fonts.semibold,
    fontSize: 24,
    textAlign: 'center',
    color: colors.gray,
  },
  timeTrackedContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
});
