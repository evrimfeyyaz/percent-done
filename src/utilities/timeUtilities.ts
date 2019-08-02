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
