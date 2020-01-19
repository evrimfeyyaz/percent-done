import React, { FunctionComponent, useRef } from 'react';
import { Section } from './Section';
import { ScrollView, StyleSheet } from 'react-native';
import { GoalRowProps } from './GoalRow';
import { BottomSheetDatePicker, Button, DaysStats, GoalList, Timetable, TimetableRow } from '..';
import { momentWithDeviceLocale } from '../../utilities';
import { Icons } from '../../../assets';

interface DayDetailsProps {
  date: Date;
  percentDone: number;
  completedMs: number;
  remainingMs: number;
  incompleteGoals: GoalRowProps[];
  completedGoals: GoalRowProps[];
  entries: TimetableRow[];
  onEditActionInteraction?: (goalId?: string) => void;
  onEntryPress?: (id: string) => void;
  onDateChange?: (date: Date) => void;
}

export const DayDetails: FunctionComponent<DayDetailsProps> = ({
                                                                 date,
                                                                 percentDone,
                                                                 completedMs,
                                                                 remainingMs,
                                                                 incompleteGoals,
                                                                 completedGoals,
                                                                 entries,
                                                                 onEditActionInteraction,
                                                                 onEntryPress,
                                                                 onDateChange,
                                                               }) => {
  const bottomSheetDatePickerRef = useRef<any>();

  const emptyText = 'Nothing to show.';
  const dateString = momentWithDeviceLocale(date).format('ll');

  function handleDateButtonPress() {
    bottomSheetDatePickerRef.current?.show();
  }

  return (
    <ScrollView style={styles.scrollView}>
      <Button title={dateString} iconSource={Icons.calendar} style={styles.dateButton}
              onPress={handleDateButtonPress} />

      <Section title="Day's Stats">
        <DaysStats percentDone={percentDone} completedMs={completedMs} remainingMs={remainingMs} />
      </Section>

      <Section title="Incomplete Goals">
        <GoalList goals={incompleteGoals} onEditActionInteraction={onEditActionInteraction}
                  emptyText={emptyText} disableLeftActions />
      </Section>

      <Section title="Completed Goals">
        <GoalList goals={completedGoals} onEditActionInteraction={onEditActionInteraction}
                  emptyText={emptyText} disableLeftActions />
      </Section>

      <Section title="Timetable">
        <Timetable entries={entries} onEntryPress={onEntryPress} />
      </Section>

      <BottomSheetDatePicker initialValue={date} onValueChange={onDateChange} ref={bottomSheetDatePickerRef} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  dateButton: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
});
