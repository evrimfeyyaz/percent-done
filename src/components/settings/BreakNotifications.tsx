import React, { FunctionComponent } from 'react';
import { DurationInput, SwitchInput } from '..';
import { StyleSheet, View, Text } from 'react-native';
import { msToHoursMinutesSeconds } from '../../utilities';
import { textStyles } from '../../theme';

interface BreakNotificationsProps {
  areNotificationsOn: boolean;
  notifyAfterInMs: number;
  onAreNotificationsOnChange?: (areNotificationsOn: boolean) => void;
  onNotifyAfterInMsChange?: (notifyAfterInMs: number) => void;
}

export const BreakNotifications: FunctionComponent<BreakNotificationsProps> = ({
                                                                                 areNotificationsOn, notifyAfterInMs,
                                                                                 onAreNotificationsOnChange, onNotifyAfterInMsChange,
                                                                               }) => {
  const duration = msToHoursMinutesSeconds(notifyAfterInMs);

  const handleNotifyAfterInMsChange = ({ hours, minutes }: { hours: number, minutes: number }) => {
    const notifyAfterInMs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);

    onNotifyAfterInMsChange?.(notifyAfterInMs);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.description, textStyles.body]}>
        If you turn "Break Notifications" on, you will get a notification after tracking your time for the duration
        you set, so you can take a break.
      </Text>

      <SwitchInput title='Break Notifications' value={areNotificationsOn} onValueChange={onAreNotificationsOnChange} />
      {areNotificationsOn && (
        <DurationInput title='Notify After' duration={duration} onDurationChange={handleNotifyAfterInMsChange} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: 30,
  },
  description: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
});
