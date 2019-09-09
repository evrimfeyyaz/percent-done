import moment, { Moment } from 'moment';

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

export function compareDays(date1: Moment, date2: Moment) {
  return date1.isSame(date2, 'day');
}

export function isToday(date: Moment) {
  const today = moment();

  return compareDays(date, today);
}

export function isTomorrow(date: Moment) {
  const tomorrow = moment().add(1, 'day');

  return compareDays(date, tomorrow);
}

export function shortDayName(date: Date) {
  return moment(date)
    .format('ddd')
    .toUpperCase();
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
