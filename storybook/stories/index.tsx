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
  MenuLink,
  StatChart,
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
import {
  array,
  boolean,
  date as dateKnob,
  number,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { colors, textStyles } from '../../src/theme';
import moment from 'moment';

addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>);
addDecorator(withKnobs);

storiesOf('Text styles', module)
  .add('Body', () => (
    <Text style={textStyles.body}>Lorem ipsum dolor sit amet.</Text>
  ))
  .add('Info', () => (
    <Text style={textStyles.info}>
      1<Text style={textStyles.infoSmall}>H</Text> 30
      <Text style={textStyles.infoSmall}>M</Text>
      <Text style={textStyles.infoTail}> done</Text>
    </Text>
  ));

storiesOf('Containers', module)
  .add('Section', () => (
    <Section title="Sample Section">
      <Text style={textStyles.body}>Lorem ipsum dolor sit amet.</Text>
    </Section>
  ))
  .add('Goal row', () => (
    <GoalRow
      name="Write"
      color={colors.yellow}
      chainLength={10}
      completedMinutes={30}
      totalMinutes={60}
    />
  ));

storiesOf('Charts', module)
  .add('Progress chart', () => {
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

    return (
      <Timetable
        entries={entries}
        onEntryPress={action('timetable-entry-pressed')}
      />
    );
  })
  .add('Achievement', () => (
    <Achievement
      title="Added a one‑time goal"
      iconSource={require('../../assets/icons/one-time-goal.png')}
    />
  ))
  .add('Achievement (done)', () => (
    <Achievement
      title="Added a one‑time goal"
      iconSource={require('../../assets/icons/one-time-goal.png')}
      done
    />
  ))
  .add('Weekly percent done chart', () => {
    const data = [
      { label: 'THU', value: 42 },
      { label: 'FRI', value: 62 },
      { label: 'SAT', value: 63 },
      { label: 'SUN', value: 83 },
      { label: 'MON', value: 61 },
      { label: 'TUE', value: 87 },
      { label: 'WED', value: 38 },
    ];

    return <StatChart data={data} min={0} max={100} />;
  })
  .add('Monthly percent done chart', () => {
    const data = [...Array(31).keys()]
      .map(dayNo => {
        const percentDone = Math.floor(Math.random() * 101);
        const date = moment()
          .subtract(dayNo, 'day')
          .format('MMM D');

        return { label: date, value: percentDone };
      })
      .reverse();

    return <StatChart data={data} min={0} max={100} />;
  })
  .add('Weekly hours done chart', () => {
    const data = [
      { label: 'THU', value: 1.4 },
      { label: 'FRI', value: 3.5 },
      { label: 'SAT', value: 2.7 },
      { label: 'SUN', value: 2.8 },
      { label: 'MON', value: 8.2 },
      { label: 'TUE', value: 1.2 },
      { label: 'WED', value: 6.1 },
    ];

    return <StatChart data={data} min={1} max={9} />;
  })
  .add('Monthly hours done chart', () => {
    const data = [...Array(31).keys()]
      .map(dayNo => {
        const hoursDone = Math.random() * 9;
        const date = moment()
          .subtract(dayNo, 'day')
          .format('MMM D');

        return { label: date, value: hoursDone };
      })
      .reverse();

    const values = data.map(el => el.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return <StatChart data={data} min={Math.floor(min)} max={Math.ceil(max)} />;
  });

storiesOf('Inputs', module)
  .add('Button', () => (
    <Button title="Press This" onPress={action('button-pressed')} />
  ))
  .add('Button with icon', () => (
    <Button
      title="Stop"
      iconSource={require('../../assets/icons/stop.png')}
      onPress={action('button-with-icon-pressed')}
    />
  ))
  .add('Text input', () => <TextInput placeholder="What is your goal?" value={text('Text', null)}
                                      onChangeText={action('text-changed')} />,
  )
  .add('Date input', () => <DateInput date={dateKnobReturningDateObj('Date', new Date())}
                                      onDateChange={action('date-changed')}
    />,
  )
  .add('Time input', () => <TimeInput time={text('Time (hh:mm)', '9:04')} onTimeChange={action('time-changed')} />)
  .add('Duration input', () => <DurationInput hours={number('Hours', 1)} minutes={number('Minutes', 0)}
                                              onDurationChange={action('duration-changed')}
    />,
  )
  .add('Switch input', () => <SwitchInput title="Time tracking" value={boolean('Value', false)}
                                          onValueChange={action('switch-value-changed')}
    />,
  )
  .add('Color input', () => {
    const inputColors = ['#CB0E0E', '#D80C82', '#A306DD', '#0910B7', '#0C69B9', '#0391A3',
      '#05B943', '#98B402', '#E0C010', '#D1760B', '#121212'];

    return (
      <ColorInput
        colors={inputColors}
        selectedColor={select('Color', inputColors, '#CB0E0E')}
        onColorChange={action('color-changed')}
      />
    );
  })
  .add('Days of week input', () => (
    <DaysOfWeekInput
      selectedDays={array('Selected days', ['Sunday', 'Monday'])}
      onDayChange={action('day-changed')}
    />
  ))
  .add('Menu link', () => <MenuLink title="Terms & Conditions" onPress={action('menu-link-pressed')} />);

storiesOf('Navigation', module)
  .add('Tab Item', () => (
    <TabItem title="Goals" />
  ))
  .add('Tab item (active)', () => (
    <TabItem title="Goals" active={true} />
  ))
  .add('Tab bar', () => {
    const tabs = ['Stats', 'Achievements', 'Time Machine', 'Commitments'];

    return (
      <TabBar
        tabTitles={tabs}
        activeTitle={select('Active tab', tabs, tabs[0])}
        onPress={action('tab-bar-press')}
      />
    );
  });

// Utilities

function dateKnobReturningDateObj(name: string, defaultValue: Date) {
  const stringTimestamp = dateKnob(name, defaultValue);

  return new Date(stringTimestamp);
}
