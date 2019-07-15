import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export interface TimetableEntry {
  title: string
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  color: string,
  id: number,
}

interface TimetableProps {
  entries: TimetableEntry[]
}

export const Timetable: FunctionComponent<TimetableProps> = ({ entries }) => {
  const makeTimeMark = (time: string) => {
    return (
      <View style={styles.timeMark} key={time}>
        <Text style={styles.time}>{time}</Text>
        <View style={styles.mark} />
      </View>
    );
  };

  const makeEntry = (entry: TimetableEntry) => {
    const positionStyle = {
      top: entryTopOffset(entry),
      height: entryHeight(entry),
      backgroundColor: entry.color,
    };

    const titleStyle = {
      color: contrastingColor(entry.color),
    };

    return (
      <View style={StyleSheet.flatten([styles.entry, positionStyle])} key={entry.id}>
        <Text style={titleStyle}>{entry.title}</Text>
      </View>
    );
  };

  const timeMarks = get24HoursIn30MinIncrements().map(timeString => makeTimeMark(timeString));

  return (
    <View style={styles.container}>
      {timeMarks}
      {entries.map(entry => makeEntry(entry))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
  timeMark: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 30,
  },
  time: {
    marginTop: 10,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.white,
    opacity: 0.2,
  },
  mark: {
    borderBottomColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    opacity: .1,
    marginBottom: 11,
    marginStart: 5,
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 57,
    right: 19,
    borderRadius: 5,
  },
});

/**
 * Returns an array of string containing the time in 30-minute increments,
 * such as '00:00', '00:30', and so on.
 */
function get24HoursIn30MinIncrements(): string[] {
  let increments: string[] = [];

  for (let i = 0; i < 24; i++) {
    const hourString = `${i}`.padStart(2, '0');

    increments.push(`${hourString}:00`);
    increments.push(`${hourString}:30`);
  }

  increments.push('24:00');

  return increments;
}

function hexToDecimal(hex: string): number {
  return parseInt(`0x${hex}`);
}

function getRedFromHex(hexCode: string): number {
  return hexToDecimal(hexCode.substring(1, 3));
}

function getGreenFromHex(hexCode: string): number {
  return hexToDecimal(hexCode.substring(3, 5));
}

function getBlueFromHex(hexCode: string): number {
  return hexToDecimal(hexCode.substring(5, 7));
}

/**
 * Returns "#fff" or "#000", whichever contrasts best with the given
 * color. Based on https://stackoverflow.com/a/3943023.
 */
function contrastingColor(hexCode: string): string {
  const r = getRedFromHex(hexCode);
  const g = getGreenFromHex(hexCode);
  const b = getBlueFromHex(hexCode);

  if ((r * 0.299 + g * 0.587 + b * 0.114) > 150) {
    return '#000';
  }

  return '#fff';
}

/**
 * Returns top position value for an entry given the starting time.
 */
function entryTopOffset(entry: TimetableEntry): number {
  const offsetFor12Am = 19;
  const offsetForAMinute = 1;

  const offsetForHour = offsetForAMinute * 60 * entry.startHour;
  const offsetForMinute = offsetForAMinute * entry.startMinute;

  return offsetFor12Am + offsetForHour + offsetForMinute;
}

/**
 * Returns height for an entry given its start and end times.
 */
function entryHeight(entry: TimetableEntry): number {
  return (entry.endHour - entry.startHour) * 60 + entry.endMinute - entry.startMinute;
}