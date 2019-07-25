import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import CenterView from './CenterView';
import {
  Achievement,
  Button,
  ColorInput,
  DateInput,
  DaysOfWeekInput,
  DurationInput,
  GoalRow,
  ProgressChart,
  Section,
  SwitchInput,
  TabBar,
  TabItem,
  TextInput,
  TimeInput,
  Timetable,
  TimetableEntry,
} from '../../src/components';
import { addDecorator } from '@storybook/react-native/dist';
import { array, boolean, date, number, select, text, withKnobs } from '@storybook/addon-knobs';
import { colors, textStyles } from '../../src/theme';

addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>);
addDecorator(withKnobs);

storiesOf('Text styles', module)
  .add('Body', () => (
    <Text style={textStyles.body}>Lorem ipsum dolor sit amet.</Text>
  ))
  .add('Info', () => (
    <Text style={textStyles.info}>
      1<Text style={textStyles.infoSmall}>H</Text> 30<Text style={textStyles.infoSmall}>M</Text>
      <Text style={textStyles.infoTail}> done</Text>
    </Text>
  ));

storiesOf('Containers', module)
  .add('Section', () => (
    <Section title='Sample Section'>
      <Text style={textStyles.body}>Lorem ipsum dolor sit amet.</Text>
    </Section>
  ))
  .add('Goal Row', () => (
    <GoalRow name='Write' color={colors.yellow} chainLength={10} completedMinutes={30} totalMinutes={60} />
  ));

storiesOf('Charts', module)
  .add('Progress Chart', () => {
    const label = 'Percent Done';
    const defaultValue = 75;
    const options = {
      range: true,
      min: 0,
      max: 100,
      step: 1,
    };

    const percentDone = number(label, defaultValue, options);

    return <ProgressChart percentDone={percentDone} />;
  })
  .add('Timetable', () => {
    const entries: TimetableEntry[] = [
      {
        title: 'Research vacation spots',
        timeTracked: true,
        startHour: 1,
        startMinute: 25,
        endHour: 2,
        endMinute: 0,
        color: '#19C403',
        id: '1',
      },
      {
        title: 'Clean up the kitchen',
        timeTracked: false,
        startHour: 5,
        startMinute: 30,
        endHour: 5,
        endMinute: 30,
        color: '#3394FA',
        id: '2',
      },
      {
        title: 'Write',
        timeTracked: true,
        startHour: 3,
        startMinute: 12,
        endHour: 4,
        endMinute: 37,
        color: '#DDD046',
        id: '3',
      },
      {
        title: 'Write',
        timeTracked: true,
        startHour: 5,
        startMinute: 30,
        endHour: 7,
        endMinute: 58,
        color: '#DDD046',
        id: '4',
      },
    ];

    return <Timetable entries={entries} onEntryPress={action('timetable-entry-pressed')} />;
  })
  .add('Achievement', () => (
    <Achievement title='Added a one‑time goal' iconSource={require('../../assets/icons/one-time-goal.png')} />
  ))
  .add('Achievement (done)', () => (
    <Achievement title='Added a one‑time goal' iconSource={require('../../assets/icons/one-time-goal.png')} done />
  ));

storiesOf('Inputs', module)
  .add('Button', () => (
    <Button title='Press This' onPress={action('button-pressed')} />
  ))
  .add('Button with icon', () => (
    <Button title='Stop' iconSource={require('../../assets/icons/stop.png')}
            onPress={action('button-with-icon-pressed')} />
  ))
  .add('Text input', () => <TextInput placeholder='What is your goal?' value={text('Text', null)}
                                      onChangeText={action('text-changed')} />)
  .add('Date input', () => <DateInput value={dateKnobReturningDateObj('Date', new Date())}
                                      onValueChange={action('date-changed')} />)
  .add('Time input', () => <TimeInput value={text('Time (hh:mm)', '9:04')} onValueChange={action('time-changed')} />)
  .add('Duration input', () => <DurationInput hours={number('Hours', 1)} minutes={number('Minutes', 0)}
                                              onValueChange={action('duration-changed')} />)
  .add('Switch input', () => <SwitchInput title='Time tracking' value={boolean('Value', false)}
                                          onValueChange={action('switch-value-changed')} />)
  .add('Color input', () => {
    const colors = ['#CB0E0E', '#D80C82', '#A306DD', '#0910B7', '#0C69B9', '#0391A3',
      '#05B943', '#98B402', '#E0C010', '#D1760B', '#121212'];

    return <ColorInput colors={colors} selectedColor={select('Color', colors, '#CB0E0E')}
                       onColorChange={action('color-changed')} />;
  })
  .add('Days of week input', () => (
      <DaysOfWeekInput
        selectedDays={array('Selected days', ['Sunday', 'Monday'])}
        onDayChange={action('day-changed')} />
    ),
  );

storiesOf('Navigation', module)
  .add('Tab Item', () => (
    <TabItem title='Goals' />
  ))
  .add('Tab item (active)', () => (
    <TabItem title='Goals' active={true} />
  ))
  .add('Tab bar', () => (
    <TabBar tabTitles={['Goals', 'Timetable']} activeTitle='Goals' onPress={action('tab-bar-press')} />));

function dateKnobReturningDateObj(name: string, defaultValue: Date) {
  const stringTimestamp = date(name, defaultValue);

  return new Date(stringTimestamp);
}