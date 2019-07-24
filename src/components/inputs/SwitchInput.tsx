import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import { StyleSheet, Switch } from 'react-native';
import { colors } from '../../theme';

interface SwitchInputProps {
  title: string,
}

export const SwitchInput: FunctionComponent<SwitchInputProps> = ({ title }) => {
  return (
    <InputContainer title={title}>
      <Switch style={styles.switch} ios_backgroundColor={colors.gray}
              trackColor={{ false: colors.gray, true: colors.orange }} />
    </InputContainer>
  );
};

const styles = StyleSheet.create({
  switch: {
    marginBottom: 6,
  },
});