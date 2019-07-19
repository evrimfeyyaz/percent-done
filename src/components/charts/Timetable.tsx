import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../theme';
import { compareTimes, durationInHoursAndMinutes, formattedTimeFromHoursAndMinutes } from '../../utilities';
import Svg, { Line } from 'react-native-svg';

/**
 * Type for timetable entries. Start hour-minute should be the same as
 * end hour-minute for entries that are not time tracked.
 */
export interface TimetableEntry {
  title: string
  timeTracked: boolean,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  color: string,
  id: string,
}

interface TimetableProps {
  entries: TimetableEntry[]
  onEntryPress: (id: string) => void
}

export const Timetable: FunctionComponent<TimetableProps> = ({ entries, onEntryPress }) => {
  const entriesSortedByStartingTime = entries.sort((e1, e2) => {
    // If starting times are equal, compare by ending times.
    if (e1.startHour === e2.startHour && e1.startMinute === e2.startMinute) {
      return compareTimes(e1.endHour, e1.endMinute, e2.endHour, e2.endMinute);
    }

    return compareTimes(e1.startHour, e1.startMinute, e2.startHour, e2.startMinute);
  });

  const makeEntry = (entry: TimetableEntry) => {
    const { hours, minutes } = durationInHoursAndMinutes(entry.startHour, entry.startMinute, entry.endHour, entry.endMinute);
    const startTime = formattedTimeFromHoursAndMinutes(entry.startHour, entry.startMinute);
    const endTime = formattedTimeFromHoursAndMinutes(entry.endHour, entry.endMinute);

    const titleColorStyle = { color: entry.color };
    const durationOrCompletion = entry.timeTracked ? `${hours}h ${minutes}m` : 'Completed';
    const times = entry.timeTracked ? `${startTime} - ${endTime}` : `${endTime}`;

    return (
      <TouchableOpacity style={styles.entry} onPress={() => onEntryPress(entry.id)} key={entry.id}>
        <Text style={[styles.entryTitle, titleColorStyle]} numberOfLines={1}>
          {entry.title}
        </Text>
        <Text style={styles.entryLength}>
          {durationOrCompletion}
        </Text>
        <Text style={styles.entryTiming}>
          {times}
        </Text>
      </TouchableOpacity>
    );
  };

  const makeUnusedTimeLine = (hours: number, minutes: number, key: string) => {
    const verticalSeparator = (
      <Svg height={16} width={4}>
        <Line
          y1='0%'
          y2='100%'
          stroke={colors.gray}
          strokeWidth={2}
          strokeDasharray={[3]}
          strokeLinecap='butt'
        />
      </Svg>
    );

    return (
      <View style={styles.unusedTime} key={key}>
        {verticalSeparator}
        <Text style={styles.unusedTimeLength}>{hours}h {minutes}m</Text>
        {verticalSeparator}
      </View>
    );
  };

  const makeTimetable = (entries: TimetableEntry[]) => {
    const timetable: Element[] = [];

    const entriesLength = entries.length;
    for (let i = 0; i < entriesLength; i++) {
      const entry = entries[i];

      timetable.push(makeEntry(entry));

      if (i + 1 === entriesLength) continue;

      const prevEntry = entries[i + 1];

      if (entry.startHour === prevEntry.startHour && entry.startMinute === prevEntry.startMinute) continue;

      const { hours: hoursUntilNextEntry, minutes: minutesUntilNextEntry } =
        durationInHoursAndMinutes(prevEntry.endHour, prevEntry.endMinute, entry.startHour, entry.startMinute);

      const key = `${i}-unused`;
      timetable.push(makeUnusedTimeLine(hoursUntilNextEntry, minutesUntilNextEntry, key));
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
    display: 'flex',
    alignItems: 'center',
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
    width: '80%',
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