import React from 'react';
import { Animated, ScrollView, Text, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import CenterView from './CenterView';
import {
  Button,
  ColorInput,
  DaysOfWeekInput,
  GoalRow,
  MenuLink,
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
  DateInput,
  ItemPicker,
  ItemInput,
  SelectBox,
  GoalList,
  SwipeableItem,
  SwipeableList,
  ProjectRow,
  ProjectList,
  ProjectRowProps,
  ProjectForm,
  ListHeader,
  PercentDoneStats,
  HoursDoneStats,
  DayDetails, Stats, Onboarding, GoalDetails, DurationInfo, Settings, License, Licenses, About,
  TextOnlyPage,
  BreakNotifications, SignIn, OnlineBackup,
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
import { Icons } from '../../assets';
import { createRandomId } from '../../src/utilities';
import { createProject } from '../../src/factories';

addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>);
addDecorator(withKnobs);

storiesOf('Charts', module)
  .add('Day details', () => (
    <DayDetails
      date={new Date()}
      percentDone={50}
      completedMs={30 * 60 * 1000}
      remainingMs={30 * 60 * 1000}
      incompleteGoals={createGoals(5)}
      completedGoals={[]}
      entries={getTimetableEntries()}
      onEntryPress={action('day-details-entry-pressed')}
      onEditActionInteraction={action('day-details-edit-action-interaction')}
      onDateChange={action('day-details-date-changed')}
    />
  ))
  .add('Day\'s Stats', () => {
    const progress = 42;
    const completedMs = 1 * 60 * 60 * 1000;
    const remainingMs = 30 * 60 * 10000;

    return <DaysStats percentDone={progress} completedMs={completedMs} remainingMs={remainingMs} />;
  })
  .add('Monthly hours done chart', () => <HoursDoneStats data={getMonthlyHoursDoneData()} />)
  .add('Weekly hours done stats', () => <HoursDoneStats data={getWeeklyHoursDoneData()} />)
  .add('Monthly percent done stats', () => <PercentDoneStats data={getMonthlyPercentDoneData()} />)
  .add('Weekly percent done stats', () => <PercentDoneStats data={getWeeklyPercentDoneData()} />)
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
  .add('Stats', () => (
      <ScrollView style={{ width: '100%' }}>
        <Stats
          hasEnoughDataToShow7DaysStats={() => true}
          hasEnoughDataToShow30DaysStats={() => true}
          statsPeriodKey='7'
          onStatsPeriodKeyChange={action('stats-period-key-changed')}
          getTotalCompletedMsForLast7Days={() => getWeeklyHoursDoneData()}
          getTotalCompletedMsForLast30Days={() => getMonthlyHoursDoneData()}
          getTotalPercentDoneForLast7Days={() => getWeeklyPercentDoneData()}
          getTotalPercentDoneForLast30Days={() => getMonthlyPercentDoneData()}
        />
      </ScrollView>
    ),
  );

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

storiesOf('Goals', module)
  .add('Goal details (tracked goal)', () => {
    return (
      <GoalDetails
        title='Write'
        chainLength={10}
        totalCompletedMs={60 * 60 * 1000}
        numOfTimesCompleted={10}
        isTracked
      />
    );
  })
  .add('Goal details (non-tracked goal)', () => {
    return (
      <GoalDetails
        title='Exercise'
        chainLength={1}
        isTracked={false}
        isCompleted={true}
        numOfTimesCompleted={10}
      />
    );
  })
  .add('Goals list', () => {
    return <GoalList goals={createGoals(100)} />;
  })
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
  .add('Time tracker', () => (
    <TimeTracker
      goalId='GOAL_ID'
      title='Work on Awesome App' color='#3394FA'
      durationInMs={60 * 60} startTimestamp={Date.now()}
      projects={[]} initialRemainingMs={30 * 60}
      onStopPress={action('time-tracker-stop-pressed')}
      onProjectChange={action('time-tracker-project-changed')}
      onProjectCreatePress={action('time-tracker-project-create-pressed')}
      onProjectRemove={action('time-tracker-project-removed')}
    />
  ))
  .add('Goal form', () => (
    <GoalForm onSubmit={action('goal-form-submission')} allGoalTitles={['Goal 1', 'Goal 2']} />
  ));

storiesOf('Projects', module)
  .add('Project row', () => <ProjectRow id='project-id' title="PercentDone" totalTimeSpentInMs={1 * 60 * 60 * 1000} />)
  .add('Project list', () => {
    return <ProjectList projects={createProjects(100)} />;
  })
  .add('Project form', () => (
    <ProjectForm
      project={createProject('PercentDone')}
      allProjectTitles={['PercentDone', 'Project 2']}
      onSubmit={action('project-form-submission')}
      onDelete={action('project-form-deletion')}
    />
  ));

storiesOf('Timetable entries', module)
  .add('Timetable entry form', () => {
    const goal1 = createGoal({ title: 'Work on PercentDone', durationInMin: 1 });
    const goal2 = createGoal({ title: 'Exercise' });
    const goal3 = createGoal({ title: 'Read', durationInMin: 1 });
    const allGoals = [goal1, goal2, goal3];

    return <TimetableEntryForm allGoals={allGoals} onSubmit={action('timetable-entry-form-submission')}
                               onDelete={(action('timetable-entry-form-deletion'))}
                               projects={[]} />;
  })
  .add('Timetable', () => {
    const entries = getTimetableEntries();

    return (
      <Timetable
        entries={entries}
        onEntryPress={action('timetable-entry-pressed')}
      />
    );
  });

storiesOf('Miscellaneous', module)
  .add('Text only page', () => {
    const text = `
    Here is some text.
    
    And here is a new paragraph.
    `;

    return <TextOnlyPage text={text} />;
  })
  .add('Section', () => (
    <Section title="Sample Section">
      <Text style={textStyles.body}>Lorem ipsum dolor sit amet.</Text>
    </Section>
  ))
  .add('Swipeable item', () => {
    const leftAction = {
      title: 'Left',
      color: 'blue',
      icon: Icons.addEntry,
      onInteraction: action('swipeable-item-left-action-interaction'),
    };

    const actionRight1 = {
      title: 'Right 1',
      color: 'yellow',
      titleStyle: { color: 'black' },
      onInteraction: action('swipeable-item-right-inner-action-interaction'),
    };

    const actionRight2 = {
      title: 'Right 2',
      color: 'red',
      icon: Icons.checkmarkLarge,
      onInteraction: action('swipeable-item-right-outer-action-interaction'),
      hideRowOnInteraction: true,
    };

    return (
      <SwipeableItem
        actionsLeft={[leftAction]}
        actionsRight={[actionRight1, actionRight2]}
        autoSelectRightOuterAction
        onSwipeBegin={action('swipeable-item-swipe-began')}
        onSwipeEnd={action('swipeable-item-swipe-ended')}
        onPress={action('swipeable-item-pressed')}
        onLeftActionsWillOpen={action('swipeable-item-left-actions-will-open')}
        onLeftActionsDidOpen={action('swipeable-item-left-actions-opened')}
        onRightActionsWillOpen={action('swipeable-item-right-actions-will-open')}
        onRightActionsDidOpen={action('swipeable-item-right-actions-opened')}
        onActionsWillClose={action('swipeable-item-actions-will-close')}
        onActionsDidClose={action('swipeable-item-actions-closed')}
      >
        <View style={{ backgroundColor: 'red', height: 100, justifyContent: 'center' }}>
          <Text style={{ color: 'white' }}>Swipeable Item</Text>
        </View>
      </SwipeableItem>
    );
  })
  .add('Swipeable list', () => {
    const hiddenActionLeft = {
      title: 'Left',
      color: 'blue',
      icon: Icons.addEntry,
      onInteraction: action('swipeable-list-left-action-interaction'),
    };

    const hiddenActionRight1 = {
      title: 'Right 1',
      color: 'yellow',
      titleStyle: { color: 'black' },
      onInteraction: action('swipeable-list-right-inner-action-interaction'),
    };

    const hiddenActionRight2 = {
      title: 'Long Titled Action',
      color: 'red',
      icon: Icons.checkmarkLarge,
      onInteraction: action('swipeable-list-right-outer-action-interaction'),
      hideRowOnInteraction: true,
    };

    return <SwipeableList
      data={createSwipeableListData(100)}
      renderItem={({ item }: { item: { id: string, title: string } }) => (
        <View style={{ height: 75 }}><Text>{item.title}</Text></View>
      )}
      actionsLeft={[hiddenActionLeft]}
      actionsRight={[hiddenActionRight1, hiddenActionRight2]}
      titleStyle={{ color: 'white' }}
      keyExtractor={item => item.id}
    />;
  })
  .add('List header', () => (
    <ListHeader
      buttonTitle='Add Something'
      description='Here is a description of this list.'
      descriptionButtonTitle='More...'
      onButtonPress={action('list-header-button-press')}
    />
  ))
  .add('Onboarding', () => (
    <Onboarding hasNotificationPermissions />
  ))
  .add('Duration info', () => (
    <DurationInfo durationInMs={60 * 60 * 1000} tailText='left' />
  ));

storiesOf('Settings', module)
  .add('Settings', () => (
    <Settings />
  ))
  .add('License', () => {
    const license = {
      'licenses': 'MIT',
      'repository': 'https://github.com/react-native-community/react-native-async-storage',
      'licenseUrl': 'https://github.com/react-native-community/react-native-async-storage/raw/master/LICENSE',
    };

    return <License licenses={license.licenses} repository={license.repository} licenseUrl={license.licenseUrl} />;
  })
  .add('Licenses', () => (
    <Licenses />
  ))
  .add('About', () => (
    <About />
  ))
  .add('Break Notifications', () => (
    <BreakNotifications
      areNotificationsOn={true}
      notifyAfterInMs={25 * 60 * 1000}
    />
  ))
  .add('Sign in or sign up', () => (
    <SignIn />
  ))
  .add('Online backup', () => (
    <OnlineBackup userEmail='hi@example.com' lastBackupDate={new Date()} />
  ));

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
        selectedColorIndex={select('Color', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0)}
        onColorIndexChange={action('color-index-changed')}
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

// Utilities

function dateKnobReturningDateObj(name: string, defaultValue: Date) {
  const stringDate = dateKnob(name, defaultValue);

  return new Date(stringDate);
}

function createGoals(num: number) {
  const goals = [];
  const allColors = [
    colors.blue, colors.yellow, colors.red, colors.orange, colors.easternBlue,
    colors.green, colors.pastelGreen, colors.offWhite, colors.easternBlue,
  ];
  const titles = ['Write', 'Read', 'Work', 'Rest', 'A Goal with a Very Very Very Very Long Title'];
  const isCompleted = [undefined, true, false];

  for (let i = 0; i < num; i++) {
    const id = createRandomId();
    const completed = isCompleted[Math.floor(Math.random() * isCompleted.length)];
    const total = Math.floor(Math.random() * 120) * 60 * 60;
    const finished = total / Math.random() * 10;

    goals.push({
      id,
      title: titles[Math.floor(Math.random() * titles.length)] + ` ${i}`,
      color: allColors[Math.floor(Math.random() * allColors.length)],
      chainLength: Math.floor(Math.random() * 100),
      isCompleted: completed,
      completedMs: completed ? undefined : total,
      totalMs: completed ? undefined : finished,
      isActiveToday: true,
    });
  }

  return goals;
}

function createProjects(num: number) {
  const projects: ProjectRowProps[] = [];
  const titles = ['PercentDone', 'IndieSumo', 'A Project with a Very Very Very Very Long Title'];

  for (let i = 0; i < num; i++) {
    const id = createRandomId();
    const totalTimeSpentInMs = Math.floor(Math.random() * 120) * 60 * 60 * 1000;

    projects.push({
      id,
      title: titles[Math.floor(Math.random() * titles.length)] + ` ${i}`,
      totalTimeSpentInMs,
    });
  }

  return projects;
}

function createSwipeableListData(num: number) {
  const data = [];
  const titles = ['Write', 'Read', 'Work', 'Rest'];

  for (let i = 0; i < num; i++) {
    const id = createRandomId();

    data.push({
      id,
      title: titles[Math.floor(Math.random() * titles.length)] + ` ${i}`,
    });
  }

  return data;
}

function getRandomHourDone() {
  return Math.random() * 10 * 60 * 60 * 1000;
}

function getTimetableEntries(): TimetableRow[] {
  const firstStart = new Date(2019, 0, 1, 10, 30).getTime();
  const firstEnd = new Date(2019, 0, 1, 12, 0).getTime();
  const secondStart = new Date(2019, 0, 1, 12, 30).getTime();
  const secondEnd = new Date(2019, 0, 1, 12, 30).getTime();
  const thirdStart = new Date(2019, 0, 1, 15, 12).getTime();
  const thirdEnd = new Date(2019, 0, 1, 15, 37).getTime();
  const fourthStart = new Date(2019, 0, 1, 19, 22).getTime();
  const fourthEnd = new Date(2019, 0, 1, 20, 13).getTime();

  return [
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
}

function getWeeklyHoursDoneData() {
  return [
    { label: 'THU', value: getRandomHourDone() },
    { label: 'FRI', value: getRandomHourDone() },
    { label: 'SAT', value: getRandomHourDone() },
    { label: 'SUN', value: getRandomHourDone() },
    { label: 'MON', value: getRandomHourDone() },
    { label: 'TUE', value: getRandomHourDone() },
    { label: 'WED', value: getRandomHourDone() },
  ];
}

function getMonthlyHoursDoneData() {
  return [...Array(31).keys()]
    .map(dayNo => {
      const date = moment()
        .subtract(dayNo, 'day')
        .format('MMM D');

      return { label: date, value: getRandomHourDone() };
    })
    .reverse();
}

function getWeeklyPercentDoneData() {
  return [
    { label: 'THU', value: 42 },
    { label: 'FRI', value: 62 },
    { label: 'SAT', value: 63 },
    { label: 'SUN', value: 83 },
    { label: 'MON', value: 61 },
    { label: 'TUE', value: 87 },
    { label: 'WED', value: 38 },
  ];
}

function getMonthlyPercentDoneData() {
  return [...Array(31).keys()]
    .map(dayNo => {
      const percentDone = Math.floor(Math.random() * 101);
      const date = moment()
        .subtract(dayNo, 'day')
        .format('MMM D');

      return { label: date, value: percentDone };
    })
    .reverse();
}
