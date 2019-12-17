import React from 'react';
import { Animated, Text, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import CenterView from './CenterView';
import {
  Button,
  ColorInput,
  DaysOfWeekInput,
  GoalRow,
  GoalRowProps,
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
  TimetableRow,
  TabInfo,
  GoalList,
  DaysStats,
  HeaderButton,
  TimePicker,
  DurationPicker,
  DurationInput,
  GoalForm,
  InputContainer,
  TimeTracker,
  TimetableEntryForm,
  DatePicker,
  DateInput, ItemPicker, ItemInput, SelectBox, SwipeableList,
} from '../../src/components';
import { addDecorator } from '@storybook/react-native/dist';
import {
  boolean,
  date as dateKnob,
  number,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { colors, textStyles } from '../../src/theme';
import moment from 'moment';
import { createGoal } from '../../src/factories';
import { RowMap } from 'react-native-swipe-list-view';

addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>);
addDecorator(withKnobs);

storiesOf('Text styles', module)
  .add('Body', () => (
    <Text style={textStyles.body}>Lorem ipsum dolor sit amet.</Text>
  ))
  .add('Info', () => (
    <Text style={textStyles.info}>
      1<Text style={textStyles.infoLabel}>H</Text> 30
      <Text style={textStyles.infoLabel}>M</Text>
      <Text style={textStyles.infoTail}> done</Text>
    </Text>
  ));

storiesOf('Miscellaneous', module)
  .add('Section', () => (
    <Section title="Sample Section">
      <Text style={textStyles.body}>Lorem ipsum dolor sit amet.</Text>
    </Section>
  ))
  .add('Goal row', () => (
    <GoalRow
      id='goal-id'
      title="Write"
      color={colors.yellow}
      chainLength={10}
      completedMs={30}
      totalMs={60}
      isActiveToday={true}
    />
  ))
  .add('Goals list', () => {
    const goals: (GoalRowProps & { key: string })[] = [
      {
        id: 'goal1',
        title: 'Write',
        color: colors.white,
        chainLength: 10,
        completedMs: 30 * 60,
        totalMs: 60 * 60,
        key: 'goal1',
        isActiveToday: true,
      },
      {
        id: 'goal2',
        title: 'Write',
        color: colors.orange,
        chainLength: 20,
        completedMs: 40 * 60,
        totalMs: 120 * 60,
        key: 'goal2',
        isActiveToday: true,
      },
      {
        id: 'goal3',
        title: 'Write',
        color: colors.blue,
        chainLength: 0,
        isCompleted: true,
        key: 'goal3',
        isActiveToday: true,
      },
    ];

    return <GoalList goals={goals} />;
  })
  .add('Time tracker', () => (
    <TimeTracker title='Work on Awesome App' color='#3394FA'
                 durationInMs={60 * 60} startTimestamp={Date.now()}
                 projects={[]} initialRemainingMs={30 * 60}
                 onStopPress={action('time-tracker-stop-pressed')}
                 onProjectChange={action('time-tracker-project-changed')}
                 onProjectCreatePress={action('time-tracker-project-create-pressed')}
                 onProjectRemove={action('time-tracker-project-removed')}
    />
  ))
  .add('Swipeable list', () => {
    const goals: (GoalRowProps & { key: string })[] = [
      {
        id: 'goal1',
        title: 'Write',
        color: colors.white,
        chainLength: 10,
        completedMs: 30 * 60,
        totalMs: 60 * 60,
        key: 'goal1',
        isActiveToday: true,
      },
      {
        id: 'goal2',
        title: 'Write',
        color: colors.orange,
        chainLength: 20,
        completedMs: 40 * 60,
        totalMs: 120 * 60,
        key: 'goal2',
        isActiveToday: true,
      },
      {
        id: 'goal3',
        title: 'Write',
        color: colors.blue,
        chainLength: 0,
        isCompleted: true,
        key: 'goal3',
        isActiveToday: true,
      },
    ];

    const hiddenItemLeft = {
      title: 'Left',
      color: 'blue',
    };

    const hiddenItemRight1 = {
      title: 'Right 1',
      color: 'yellow',
    };

    const hiddenItemRight2 = {
      title: 'Right 2',
      color: 'red',
    };

    return <SwipeableList
      data={goals}
      renderItem={item => (<View style={{ height: 50 }}><Text>{item.item.title}</Text></View>)}
      hiddenActionsLeft={[hiddenItemLeft]}
      hiddenActionsRight={[hiddenItemRight1, hiddenItemRight2]}
      autoSelectRightOuterAction
      leftOpenValue={100}
      rightOpenValue={200}
    />;
  });

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
    const firstStart = new Date(2019, 0, 1, 10, 30).getTime();
    const firstEnd = new Date(2019, 0, 1, 12, 0).getTime();
    const secondStart = new Date(2019, 0, 1, 12, 30).getTime();
    const secondEnd = new Date(2019, 0, 1, 12, 30).getTime();
    const thirdStart = new Date(2019, 0, 1, 15, 12).getTime();
    const thirdEnd = new Date(2019, 0, 1, 15, 37).getTime();
    const fourthStart = new Date(2019, 0, 1, 19, 22).getTime();
    const fourthEnd = new Date(2019, 0, 1, 20, 13).getTime();

    const entries: TimetableRow[] = [
      {
        title: 'Research vacation spots',
        timeTracked: true,
        startTimestamp: firstStart,
        endTimestamp: firstEnd,
        color: '#19C403',
        id: '1',
      },
      {
        title: 'Clean up the kitchen',
        timeTracked: false,
        startTimestamp: secondStart,
        endTimestamp: secondEnd,
        color: '#3394FA',
        id: '2',
      },
      {
        title: 'Write',
        timeTracked: true,
        startTimestamp: thirdStart,
        endTimestamp: thirdEnd,
        color: '#DDD046',
        id: '3',
      },
      {
        title: 'Write',
        timeTracked: true,
        startTimestamp: fourthStart,
        endTimestamp: fourthEnd,
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
  })
  .add('Day\'s Stats', () => {
    const progress = 42;
    const completedMs = 1 * 60 * 60 * 1000;
    const remainingMs = 30 * 60 * 10000;

    return <DaysStats percentDone={progress} completedMs={completedMs} remainingMs={remainingMs} />;
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
  .add('Input container', () => <InputContainer title='Test Input' value='123' />)
  .add('Input container with error', () => <InputContainer title='Test Input' value='123' error='Test error' />)
  .add('Text input', () => <TextInput placeholder="What is your goal?" value={text('Text', '')}
                                      onChangeText={action('text-changed')} />,
  )
  .add('Time input', () => <TimeInput title='Time' time={dateKnobReturningDateObj('Date', new Date())}
                                      onTimeChange={action('time-changed')} />)
  .add('Date input', () => <DateInput title='Date' date={dateKnobReturningDateObj('Date', new Date())}
                                      onDateChange={action('date-changed')} />)
  .add('Duration input', () => <DurationInput duration={{ hours: 1, minutes: 0 }}
                                              onDurationChange={action('duration-changed')}
    />,
  )
  .add('Item input', () => {
    const allItems = [
      { key: '0', value: 'Read' },
      { key: '1', value: 'Work on PercentDone' },
      { key: '2', value: 'Write' },
    ];

    return <ItemInput title='Goal' itemKey={allItems[0].key} onItemChange={action('item-changed')}
                      allItems={allItems} />;
  })
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
      title='Days of week'
      selectedDays={[true, true, true, true, true, true, true]}
      onDaysChange={action('day-changed')}
    />
  ))
  .add('Menu link', () => <MenuLink title="Terms & Conditions" onPress={action('menu-link-pressed')} />)
  .add('Time picker', () => <TimePicker initialValue={new Date()} />)
  .add('Duration picker', () => <DurationPicker initialValue={{ hours: 1, minutes: 0 }} />)
  .add('Item picker', () => {
    const allValues = [
      { key: '0', value: 'Read' },
      { key: '1', value: 'Work on PercentDone' },
      { key: '2', value: 'Write' },
    ];

    return <ItemPicker initialValue={allValues[0]} allValues={allValues} />;
  })
  .add('Date picker', () => <DatePicker initialValue={new Date()} />)
  .add('Select box', () => {
    const data = [
      { key: 'second-item', title: 'Second item' },
      { key: 'first-item', title: 'First item' },
      {
        key: 'super-long-item',
        title: 'This is a super long item that has way too much text in its title, I mean why?',
      },
    ];
    return <SelectBox data={data} onItemPress={action('select-box-item-pressed')} cancelButtonTitle='Cancel'
                      onCancelPress={action('select-box-cancel-pressed')}
                      onCreatePress={action('select-box-create-pressed')} />;
  });

storiesOf('Navigation', module)
  .add('Tab Item', () => (
    <TabItem title="Goals" index={0} />
  ))
  .add('Tab item (active)', () => (
    <TabItem title="Goals" index={0} selectionStatus={new Animated.Value(1)} />
  ))
  .add('Tab bar', () => {
    const tabs: TabInfo[] = [
      { key: 'tab1', title: 'Stats' },
      { key: 'tab2', title: 'Achievements' },
      { key: 'tab3', title: 'Time Machine' },
      { key: 'tab4', title: 'Commitments' },
    ];

    return (
      <TabBar
        selectedIndex={0}
        tabs={tabs}
        onTabChange={action('tab-change')}
      />
    );
  })
  .add('Header button', () => (
    <View
      style={{ backgroundColor: 'white', width: '100%', height: 150, justifyContent: 'center', alignItems: 'center' }}>
      <HeaderButton title='Add Goal' onPress={action('header-button-press')} />
    </View>
  ))
  .add('Header button (primary)', () => (
    <View
      style={{ backgroundColor: 'white', width: '100%', height: 150, justifyContent: 'center', alignItems: 'center' }}>
      <HeaderButton title='Add Goal' primary onPress={action('header-button-press')} />
    </View>
  ));

storiesOf('Forms', module)
  .add('Goal form', () => (
    <GoalForm onSubmit={action('goal-form-submission')} />
  ))
  .add('Timetable entry form', () => {
    const goal1 = createGoal({ title: 'Work on PercentDone', durationInMin: 1 });
    const goal2 = createGoal({ title: 'Exercise' });
    const goal3 = createGoal({ title: 'Read', durationInMin: 1 });
    const allGoals = [goal1, goal2, goal3];

    return <TimetableEntryForm allGoals={allGoals} onSubmit={action('timetable-entry-form-submission')}
                               onDelete={(action('timetable-entry-form-deletion'))} />;
  });

// Utilities

function dateKnobReturningDateObj(name: string, defaultValue: Date) {
  const stringTimestamp = dateKnob(name, defaultValue);

  return new Date(stringTimestamp);
}
