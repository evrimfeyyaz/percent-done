import moment, { min, Moment } from 'moment';
import 'moment/min/locales';
import { NativeModules, Platform } from 'react-native';

export function durationInHoursAndMinutes(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): { hours: number; minutes: number } {
  let minutes = endMinute - startMinute;
  let hours = endHour - startHour;

  if (minutes < 0) {
    // Means less than one hour difference.
    hours -= 1;
    minutes += 60;
  }

  return { hours, minutes };
}

// TODO: Add time localization.
export function formattedTimeFromHoursAndMinutes(
  hours: number,
  minutes: number,
): string {
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export function compareTimes(
  hour1: number,
  minute1: number,
  hour2: number,
  minute2: number,
) {
  if (hour1 === hour2) {
    return minute2 - minute1;
  }

  return hour2 - hour1;
}

/**
 * Creates a string from a given date that can be
 * used as an index denoting the day in an object.
 */
export function convertDateToIndex(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function compareDateIndices(dateIdx1: string, dateIdx2: string) {
  const [year1, month1, day1] = dateIdx1.split('-').map(t => parseInt(t));
  const [year2, month2, day2] = dateIdx2.split('-').map(t => parseInt(t));

  if (year1 !== year2) {
    return year1 - year2;
  } else if (month1 !== month2) {
    return month1 - month2;
  } else {
    return day1 - day2;
  }
}

export function convertSecondsToHoursAndMinutes(seconds: number): { hours: number, minutes: number } {
  const totalMinutes = seconds / 60;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

/**
 * This returns the beginning of day, as new Date() also includes the time,
 * which would prevent selectors to be memoized properly as the time changes
 * within a day.
 */
export function getBeginningOfDay(date: Date) {
  return moment(date).startOf('day').toDate();
}

export function isLocale24Hours() {
  const oneOClock = momentWithDeviceLocale(new Date(2019, 0, 1, 13));

  return oneOClock.format('LT') === '13:00';
}

export function momentWithDeviceLocale(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean) {
  let deviceLocale = Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;
  deviceLocale = deviceLocale || 'en-US';

  return moment(inp, format, strict).locale(deviceLocale);
}

export function msToHoursMinutesSeconds(ms: number): string {
  const totalSeconds = ms / 1000;
  const totalMinutes = totalSeconds / 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes - (hours * 60));
  const seconds = Math.floor(totalSeconds - (minutes * 60) - (hours * 60 * 60));

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function msToHoursMinutes(ms: number): string {
  const [hour, min] = msToHoursMinutesSeconds(ms).split(':');

  return `${hour}:${min}`;
}
