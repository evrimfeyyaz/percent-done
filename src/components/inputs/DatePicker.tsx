import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollablePicker } from './ScrollablePicker';
import { momentWithDeviceLocale } from '../../utilities';

interface DatePickerProps {
  initialValue: Date;
  onValueChange?: (value: Date) => void;
}

export const DatePicker: FunctionComponent<DatePickerProps> = ({ initialValue, onValueChange }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const minYear = currentYear - 100;

  const [selectedDate, setSelectedDate] = useState(initialValue);

  const handleYearChange = (index: number) => {
    const newYear = index + minYear;
    const newDate = adjustDate(selectedDate, newYear, selectedDate.getMonth(), selectedDate.getDate());

    setSelectedDate(newDate);
    onValueChange?.(newDate);
  };

  const handleMonthChange = (index: number) => {
    const newDate = adjustDate(selectedDate, selectedDate.getFullYear(), index, selectedDate.getDate());

    setSelectedDate(newDate);
    onValueChange?.(newDate);
  };

  const handleDayChange = (index: number) => {
    const newDay = index + 1;
    const newDate = adjustDate(selectedDate, selectedDate.getFullYear(), selectedDate.getMonth(), newDay);

    setSelectedDate(newDate);
    onValueChange?.(newDate);
  };

  /**
   * Returns the last selectable day given a month and a year.
   *
   * @param year
   * @param month Between 0 to 11.
   */
  const getLastSelectableDay = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    let daysInMonth = momentWithDeviceLocale(date).daysInMonth();

    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() === month) {
      daysInMonth = today.getDate();
    }

    return daysInMonth;
  };

  const getLastSelectableMonth = (year: number) => {
    const today = new Date();
    if (today.getFullYear() === year) {
      return today.getMonth();
    }

    return 11;
  };

  /**
   * Adjusts the date without mutating it while ensuring it does not exceed the last day
   * of the month or the current day. Returns a new Date object with the adjustments.
   *
   * For example, when "December 31" is selected, and the month is changed to "November",
   * we need to make sure that the last selectable day is "30," and it is the day that
   * is selected.
   *
   * @param date
   * @param year
   * @param month Between 0 to 11.
   * @param day
   */
  const adjustDate = (date: Date, year: number, month: number, day: number): Date => {
    const newDate = new Date(date);
    // We need to set the current day to the first day of the month,
    // otherwise, when we change the month, say from March 31 to February,
    // it would overflow back to March, instead of staying in February,
    // as February has 28 or 29 days.
    newDate.setDate(1);

    newDate.setFullYear(year);

    const lastSelectableMonth = getLastSelectableMonth(year);
    if (lastSelectableMonth < month) {
      newDate.setMonth(lastSelectableMonth);
    } else {
      newDate.setMonth(month);
    }

    const lastSelectableDay = getLastSelectableDay(year, month);
    if (lastSelectableDay < day) {
      newDate.setDate(lastSelectableDay);
    } else {
      newDate.setDate(day);
    }

    return newDate;
  };

  const years: number[] = [];
  for (let i = currentYear; i >= minYear; i--) years.unshift(i);
  const yearsData = years.map(year => ({ key: `year-${year}`, value: year.toString() }));
  const yearIndex = years.indexOf(selectedDate.getFullYear());

  const monthIndex = selectedDate.getMonth();
  let months = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December',
  ];
  months = months.slice(0, getLastSelectableMonth(selectedDate.getFullYear()) + 1);
  const monthsData = months.map(month => ({ key: `month-${month}`, value: month }));

  const days: number[] = [];
  const lastSelectableDay = getLastSelectableDay(selectedDate.getFullYear(), selectedDate.getMonth());
  for (let i = 1; i <= lastSelectableDay; i++) days.push(i);
  const daysData = days.map(day => ({ key: `day-${day}`, value: day.toString() }));
  const dayIndex = selectedDate.getDate() - 1;

  return (
    <View style={styles.container}>
      <ScrollablePicker data={yearsData} index={yearIndex} style={styles.picker} onIndexChange={handleYearChange}
                        alignment='center' />
      <ScrollablePicker data={monthsData} index={monthIndex} style={styles.picker} onIndexChange={handleMonthChange}
                        alignment='center' />
      <ScrollablePicker data={daysData} index={dayIndex} style={styles.picker} onIndexChange={handleDayChange}
                        alignment='center' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    paddingHorizontal: 30,
  },
  picker: {
    marginHorizontal: 10,
  },
});
