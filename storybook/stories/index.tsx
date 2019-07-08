import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CenterView from './CenterView';
import { Body, ProgressChart, Section } from '../../src/components';
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

    return (<ProgressChart percentDone={percentDone} />);
  });