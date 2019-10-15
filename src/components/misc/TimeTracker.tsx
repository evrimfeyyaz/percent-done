import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../../theme';
import { momentWithDeviceLocale, msToHoursMinutes, msToHoursMinutesSeconds } from '../../utilities';
import { BottomSheetTimePicker, Button, ProgressChart } from '..';
import { Icons } from '../../../assets';

interface TimeTrackerProps {
  title: string;
  color: string;
  durationInSeconds: number;
  /**
   * Remaining seconds for the goal.
   */
  initialRemainingSeconds: number;
  /**
   * Starting timestamp for the time tracker.
   */
  startTimestamp: number;
  onStopPress?: (startTimestamp: number, endTimestamp: number) => void;
  onStartTimestampChange?: (newTimestamp: number) => void;
}

export const TimeTracker: FunctionComponent<TimeTrackerProps> = ({
                                                                   title, color, durationInSeconds, startTimestamp,
                                                                   initialRemainingSeconds, onStopPress, onStartTimestampChange,
                                                                 }) => {
  const bottomSheetTimePickerRef = useRef<BottomSheetTimePicker>(null);

  const [msPassed, setMsPassed] = useState(0);

  let interval: NodeJS.Timeout;
  useEffect(() => {
    interval = setInterval(() => tick(), 1000);
    return () => {
      clearInterval(interval);
    };
  });

  function tick() {
    setMsPassed(Date.now() - startTimestamp);
  }

  const handleStartedAtPress = () => bottomSheetTimePickerRef?.current?.show();

  const handleStartedAtTimeChange = (time: Date) => {
    const newTimestamp = time.getTime();

    if (newTimestamp > Date.now()) return;

    onStartTimestampChange?.(newTimestamp);
  };

  const handleStopPress = () => onStopPress?.(startTimestamp, Date.now());

  const titleColorStyle = { color };

  const secondsPassed = msPassed / 1000;
  const completedSeconds = (durationInSeconds - initialRemainingSeconds) + secondsPassed;
  const percentDone = completedSeconds / durationInSeconds * 100;

  const remainingSeconds = durationInSeconds - initialRemainingSeconds - secondsPassed;

  const startedAt = momentWithDeviceLocale(startTimestamp).format('LT');

  return (
    <View style={styles.container}>
      <Text style={StyleSheet.flatten([styles.title, titleColorStyle])}>{title}</Text>
      <Text style={styles.timePassed}>{msToHoursMinutesSeconds(msPassed)}</Text>
      <ProgressChart percentDone={percentDone} />
      <Text style={styles.timeLeft}>
        {msToHoursMinutes(remainingSeconds * 1000)}&nbsp;
        <Text style={styles.timeLeftLabel}>left</Text>
      </Text>
      <Button iconSource={Icons.stop} title='Stop' style={styles.stopButton} onPress={handleStopPress} />
      <TouchableOpacity onPress={handleStartedAtPress}>
        <View style={styles.startedAtContainer}>
          <Text style={styles.startedAtLabel}>Started at</Text>
          <View style={styles.startedAtBottomLine}>
            <Text style={styles.startedAt}>{startedAt}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <BottomSheetTimePicker ref={bottomSheetTimePickerRef} initialTime={new Date(startTimestamp)}
                             onTimeChange={handleStartedAtTimeChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 28,
  },
  timePassed: {
    fontFamily: fonts.semibold,
    fontSize: 32,
    color: colors.white,
    marginBottom: 30,
  },
  timeLeft: {
    marginTop: 10,
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.white,
  },
  timeLeftLabel: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.gray,
    textTransform: 'uppercase',
  },
  stopButton: {
    marginTop: 25,
  },
  startedAtContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  startedAtLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.white,
  },
  startedAt: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.yellow,
  },
  startedAtBottomLine: {
    borderBottomColor: colors.yellow,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
