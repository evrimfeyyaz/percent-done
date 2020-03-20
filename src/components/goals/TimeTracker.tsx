import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts } from '../../theme';
import {
  formatDurationInMs,
  leftOrOver,
  momentWithDeviceLocale, playBreakNotificationSound,
  playGoalCompletedNotificationSound,
  usePrevious,
} from '../../utilities';
import { BottomSheetTimePicker, Button, ProgressChart, ProjectModal } from '..';
import { Icons } from '../../../assets';

export interface TimeTrackerProps {
  goalId: string;
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
  projects: { key: string; title: string }[];
  projectKey?: string;
  areBreakNotificationsOn?: boolean;
  notifyBreakAfterInMs?: number;
  onStopPress?: (startTimestamp: number, endTimestamp: number) => void;
  onStartTimestampChange?: (newTimestamp: number) => void;
  onProjectCreatePress?: (projectTitle: string, goalId: string) => void;
  onProjectChange?: (projectKey: string, goalId: string) => void;
  onProjectRemove?: (goalId: string) => void;
  onDidUnmount?: () => void;
  /**
   * Called when the current date moves to the next day of `startTimestamp`.
   */
  onDateChange?: () => void;
}

export const TimeTracker: FunctionComponent<TimeTrackerProps> = ({
                                                                   goalId, title, color, durationInMs, startTimestamp,
                                                                   initialRemainingMs, projects, projectKey,
                                                                   areBreakNotificationsOn, notifyBreakAfterInMs,
                                                                   onStopPress, onStartTimestampChange, onProjectChange,
                                                                   onProjectRemove, onProjectCreatePress, onDidUnmount,
                                                                   onDateChange,
                                                                 }) => {
  const bottomSheetTimePickerRef = useRef(null);

  const [msPassed, setMsPassed] = useState(0);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [stopButtonTitle, setStopButtonTitle] = useState('Stop');

  const beginningOfNextDay = +momentWithDeviceLocale(startTimestamp).add(1, 'day').startOf('day');

  const isCompleted = msPassed >= initialRemainingMs;
  const shouldTakeBreak = areBreakNotificationsOn ? msPassed >= (notifyBreakAfterInMs ?? 0) : false;

  const BREAK_TITLE = 'Time to Take a Break';
  const GOAL_COMPLETED_TITLE = 'Goal Completed';

  const prevIsCompleted = usePrevious(isCompleted);
  const prevShouldTakeBreak = usePrevious(shouldTakeBreak);

  useEffect(() => {


    return onDidUnmount;
  }, []);

  let interval: number;
  useEffect(() => {
    interval = setInterval(() => tick(), 100);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (prevShouldTakeBreak === false && shouldTakeBreak) {
      playBreakNotificationSound();
      setStopButtonTitle(BREAK_TITLE);
    } else {
      setStopButtonTitleToProperValue();
    }
  }, [shouldTakeBreak]);

  useEffect(() => {
    if (prevIsCompleted === false && isCompleted) {
      playGoalCompletedNotificationSound();
      setStopButtonTitle(GOAL_COMPLETED_TITLE);
    } else {
      setStopButtonTitleToProperValue();
    }
  }, [isCompleted]);

  function tick() {
    const now = Date.now();
    setMsPassed(now - startTimestamp);

    if (now >= beginningOfNextDay) {
      onDateChange?.();
    }
  }

  function setStopButtonTitleToProperValue() {
    if (isCompleted) {
      setStopButtonTitle(GOAL_COMPLETED_TITLE);
    } else if (shouldTakeBreak) {
      setStopButtonTitle(BREAK_TITLE);
    } else {
      setStopButtonTitle('Stop');
    }
  }

  // @ts-ignore
  const handleStartedAtPress = () => bottomSheetTimePickerRef?.current?.show();

  const toggleProjectModal = () => setIsProjectModalVisible(!isProjectModalVisible);

  const handleStartedAtTimeChange = (time: Date) => {
    const newTimestamp = time.getTime();
    if (newTimestamp > Date.now()) return;

    onStartTimestampChange?.(newTimestamp);
  };

  const handleStopPress = () => onStopPress?.(startTimestamp, Date.now());

  const handleProjectCreatePress = (title: string) => {
    setIsProjectModalVisible(false);
    onProjectCreatePress?.(title, goalId);
  };

  const handleProjectPress = (key: string) => {
    setIsProjectModalVisible(false);

    if (projectKey !== key) {
      onProjectChange?.(key, goalId);
    }
  };

  const handleProjectRemovePress = () => {
    setIsProjectModalVisible(false);
    onProjectRemove?.(goalId);
  };

  const titleColorStyle = { color };

  const completedMs = (durationInMs - initialRemainingMs) + msPassed;

  let percentDone = 100;
  if (durationInMs !== 0) {
    percentDone = completedMs / durationInMs * 100;
  }

  const remainingMs = initialRemainingMs - msPassed;

  const startedAt = momentWithDeviceLocale(startTimestamp).format('LT');

  let project;
  if (projectKey != null) {
    project = projects.find(project => project.key === projectKey);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} alwaysBounceVertical={false}
                showsVerticalScrollIndicator>
      <Text style={[styles.title, titleColorStyle]}>{title}</Text>
      <TouchableOpacity style={styles.projectContainer} onPress={toggleProjectModal}>
        <View style={styles.textButtonContainer}>
          <Text style={styles.textButtonLabel}>What are you working on?</Text>
          <View style={styles.textButtonBottomLine}>
            <Text style={styles.textButton}>{project?.title || 'Tap to select project'}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styles.timePassed}>{formatDurationInMs(msPassed)}</Text>
      <ProgressChart percentDone={percentDone} />
      <Text style={styles.timeLeft}>
        {formatDurationInMs(remainingMs, remainingMs > 0)}&nbsp;
        <Text style={styles.timeLeftLabel}>{leftOrOver(remainingMs)}</Text>
      </Text>
      <Button iconSource={Icons.stop} title={stopButtonTitle} style={styles.stopButton} onPress={handleStopPress} />
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
      <ProjectModal
        projects={projects}
        isVisible={isProjectModalVisible}
        allProjectTitles={projects.map(project => project.title)}
        onProjectCreatePress={handleProjectCreatePress}
        onProjectPress={handleProjectPress}
        onProjectRemovePress={handleProjectRemovePress}
        onProjectModalHideRequest={toggleProjectModal}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 28,
    marginBottom: 10,
    marginHorizontal: 30,
    textAlign: 'center',
    lineHeight: 32,
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
  projectModal: {
    width: '80%',
    height: '50%',
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
});
