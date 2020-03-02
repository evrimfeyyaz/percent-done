import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { formatDurationInMs, formatTimeInTimestamp } from '../../utilities';
import Svg, { Line } from 'react-native-svg';
import { EmptyContainer } from '..';

export interface TimetableRow {
  title: string;
  timeTracked: boolean;
  startTimestamp: number;
  endTimestamp: number;
  color: string;
  id: string;
}

export interface TimetableProps {
  entries: TimetableRow[];
  onEntryPress?: (id: string) => void;
}

export const Timetable: FunctionComponent<TimetableProps> = ({
                                                               entries,
                                                               onEntryPress,
                                                             }) => {
  const entriesSortedByStartingTime = entries.sort((e1, e2) => {
    if (e1.startTimestamp === e2.startTimestamp) {
      return e2.endTimestamp - e1.startTimestamp;
    }

    return e2.startTimestamp - e1.startTimestamp;
  });

  const makeRow = (entry: TimetableRow) => {
    const duration = formatDurationInMs(entry.endTimestamp - entry.startTimestamp);
    const startTime = formatTimeInTimestamp(entry.startTimestamp);
    const endTime = formatTimeInTimestamp(entry.endTimestamp);

    const titleColorStyle = { color: entry.color };
    const durationOrCompletion = entry.timeTracked
      ? duration
      : 'Completed';
    const times = entry.timeTracked
      ? `${startTime} - ${endTime}`
      : `${endTime}`;

    return (
      <TouchableOpacity
        style={styles.entry}
        onPress={() => onEntryPress?.(entry.id)}
        key={entry.id}
      >
        <Text style={[styles.entryTitle, titleColorStyle]} numberOfLines={1}>
          {entry.title}
        </Text>
        <Text style={styles.entryLength}>{durationOrCompletion}</Text>
        <Text style={styles.entryTiming}>{times}</Text>
      </TouchableOpacity>
    );
  };

  const makeUnusedTimeLine = (durationInMs: number, key: string) => {
    const verticalSeparator = (
      <Svg height={16} width={4}>
        <Line
          y1="0%"
          y2="100%"
          stroke={colors.gray}
          strokeWidth={2}
          strokeDasharray={[3]}
          strokeLinecap="butt"
        />
      </Svg>
    );

    return (
      <View style={styles.unusedTime} key={key}>
        {verticalSeparator}
        <Text style={styles.unusedTimeLength}>
          {formatDurationInMs(durationInMs)}
        </Text>
        {verticalSeparator}
      </View>
    );
  };

  const makeTimetable = (timetableEntries: TimetableRow[]) => {
    const timetable: Element[] = [];

    const entriesLength = timetableEntries.length;

    if (entriesLength === 0) {
      return <EmptyContainer text='There are no entries.' />;
    }

    for (let i = 0; i < entriesLength; i++) {
      const entry = timetableEntries[i];

      timetable.push(makeRow(entry));

      if (i + 1 === entriesLength) {
        continue;
      }

      const prevEntry = timetableEntries[i + 1];

      if (entry.startTimestamp === prevEntry.startTimestamp) continue;

      const durationUntilNextEntry = entry.startTimestamp - prevEntry.endTimestamp;

      const key = `${i}-unused`;
      timetable.push(
        makeUnusedTimeLine(durationUntilNextEntry, key),
      );
    }

    return timetable;
  };

  return (
    <View style={styles.container}>
      {makeTimetable(entriesSortedByStartingTime)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.darkGray,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: '50%',
  },
  entryTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    flexShrink: 1,
  },
  entryLength: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.white,
  },
  entryTiming: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.gray,
  },
  unusedTime: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  unusedTimeLength: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.gray,
    marginBottom: 5,
    marginTop: 5,
  },
});
