import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import CenterView from './CenterView';
import {
  Body,
  Button,
  colors,
  ProgressChart,
  Section,
  GoalRow,
  TabItem,
  TabBar,
  Timetable, TimetableEntry,
} from '../../src/components';
import { addDecorator } from '@storybook/react-native/dist';
import { withKnobs, number } from '@storybook/addon-knobs';

addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>);
addDecorator(withKnobs);

storiesOf('Typography', module)
  .add('Body', () => (
    <Body>Lorem ipsum dolor sit amet.</Body>
  ));

storiesOf('Containers', module)
  .add('Section', () => (
    <Section title={'Sample Section'}>
      <Body>Lorem ipsum dolor sit amet.</Body>
    </Section>
  ))
  .add('Goal Row', () => (
    <GoalRow name={'Write'} color={colors.yellow} chainLength={10} completedMinutes={30} totalMinutes={60} />
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
        startHour: 1,
        startMinute: 25,
        endHour: 2,
        endMinute: 0,
        color: '#19C403',
        id: 1,
      },
      {
        title: 'Write',
        startHour: 3,
        startMinute: 12,
        endHour: 4,
        endMinute: 37,
        color: '#000000',
        id: 2,
      },
    ];

    return <Timetable entries={entries} />;
  });

storiesOf('Inputs', module)
  .add('Button', () => (
    <Button title={'Press This'} onPress={action('button-pressed')} />
  ))
  .add('Button with icon', () => (
    <Button title={'Stop'} iconSource={require('../../assets/icons/stop.png')}
            onPress={action('button-with-icon-pressed')} />
  ));

storiesOf('Navigation', module)
  .add('Tab Item', () => (
    <TabItem title={'Goals'} />
  ))
  .add('Tab Item (Active)', () => (
    <TabItem title={'Goals'} active={true} />
  ))
  .add('Tab Bar', () => (
    <TabBar tabTitles={['Goals', 'Timetable']} activeTitle={'Goals'} onPress={action('tab-bar-press')} />));