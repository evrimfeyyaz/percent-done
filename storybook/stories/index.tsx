import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import CenterView from './CenterView';
import {
  Button,
  ProgressChart,
  Section,
  GoalRow,
  TabItem,
  TabBar,
  Timetable, TimetableEntry, Achievement, TextInput, DateInput, TimeInput, DurationInput, SwitchInput,
} from '../../src/components';
import { addDecorator } from '@storybook/react-native/dist';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
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
  .add('Text input', () => <TextInput placeholder='What is your goal?' />)
  .add('Date input', () => <DateInput />)
  .add('Time input', () => <TimeInput />)
  .add('Duration input', () => <DurationInput />)
  .add('Switch input', () => {
    return <SwitchInput title='Time tracking' value={boolean('Value', false)}
                        onValueChange={action('switch-value-changed')} />;
  });

storiesOf('Navigation', module)
  .add('Tab Item', () => (
    <TabItem title='Goals' />
  ))
  .add('Tab item (active)', () => (
    <TabItem title='Goals' active={true} />
  ))
  .add('Tab bar', () => (
    <TabBar tabTitles={['Goals', 'Timetable']} activeTitle='Goals' onPress={action('tab-bar-press')} />));