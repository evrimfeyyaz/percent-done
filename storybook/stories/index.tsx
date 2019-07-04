import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CenterView from './CenterView';
import { Body, Section } from '../../src/components';
import { addDecorator } from '@storybook/react-native/dist';

addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>);

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