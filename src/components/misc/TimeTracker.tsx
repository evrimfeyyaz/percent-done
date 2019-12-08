import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts } from '../../theme';
import { formatDurationInMs, leftOrOver, momentWithDeviceLocale } from '../../utilities';
import { BottomSheetTimePicker, Button, ProgressChart } from '..';
import { Icons } from '../../../assets';

export interface TimeTrackerProps {
  title: string;
  color: string;
  durationInMs: number;
  /**
   * Remaining milliseconds for the goal.
   */
  initialRemainingMs: number;
  /**
   * Starting timestamp for the time tracker.
   */
  startTimestamp: number;
  onStopPress?: (startTimestamp: number, endTimestamp: number) => void;
  onStartTimestampChange?: (newTimestamp: number) => void;
}

export const TimeTracker: FunctionComponent<TimeTrackerProps> = ({
                                                                   title, color, durationInMs, startTimestamp,
                                                                   initialRemainingMs, onStopPress, onStartTimestampChange,
                                                                 }) => {
  const bottomSheetTimePickerRef = useRef(null);

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

  // @ts-ignore
  const handleStartedAtPress = () => bottomSheetTimePickerRef?.current?.show();

  const handleStartedAtTimeChange = (time: Date) => {
    const newTimestamp = time.getTime();

    if (newTimestamp > Date.now()) return;

    onStartTimestampChange?.(newTimestamp);
  };

  const handleStopPress = () => onStopPress?.(startTimestamp, Date.now());

  const titleColorStyle = { color };

  const completedMs = (durationInMs - initialRemainingMs) + msPassed;
  const percentDone = completedMs / durationInMs * 100;

  const remainingMs = initialRemainingMs - msPassed;

  const startedAt = momentWithDeviceLocale(startTimestamp).format('LT');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} alwaysBounceVertical={false}>
      <Text style={StyleSheet.flatten([styles.title, titleColorStyle])}>{title}</Text>
      <TouchableOpacity style={styles.projectContainer}>
        <View style={styles.textButtonContainer}>
          <Text style={styles.textButtonLabel}>What are you working on?</Text>
          <View style={styles.textButtonBottomLine}>
            <Text style={styles.textButton}>PercentDone</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styles.timePassed}>{formatDurationInMs(msPassed)}</Text>
      <ProgressChart percentDone={percentDone} />
      <Text style={styles.timeLeft}>
        {formatDurationInMs(remainingMs, true)}&nbsp;
        <Text style={styles.timeLeftLabel}>{leftOrOver(remainingMs)}</Text>
      </Text>
      <Button iconSource={Icons.stop} title='Stop' style={styles.stopButton} onPress={handleStopPress} />
      <TouchableOpacity onPress={handleStartedAtPress}>
        <View style={styles.textButtonContainer}>
          <Text style={styles.textButtonLabel}>Started at</Text>
          <View style={styles.textButtonBottomLine}>
            <Text style={styles.textButton}>{startedAt}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <BottomSheetTimePicker ref={bottomSheetTimePickerRef} initialValue={new Date(startTimestamp)}
                             onValueChange={handleStartedAtTimeChange} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 28,
    marginBottom: 10,
  },
  projectContainer: {
    marginBottom: 50,
  },
  timePassed: {
    fontFamily: fonts.semibold,
    fontSize: 32,
    color: colors.white,
    marginBottom: 10,
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
    marginBottom: 70,
  },
  textButtonContainer: {
    alignItems: 'center',
  },
  textButtonLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.white,
  },
  textButton: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.yellow,
  },
  textButtonBottomLine: {
    borderBottomColor: colors.yellow,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
