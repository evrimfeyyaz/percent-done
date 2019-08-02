import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import { Platform, StyleSheet, Switch } from 'react-native';
import { colors } from '../../theme';

interface SwitchInputProps {
  title: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

export const SwitchInput: FunctionComponent<SwitchInputProps> = ({
                                                                   title,
                                                                   value = false,
                                                                   onValueChange,
                                                                 }) => {
  return (
    <InputContainer title={title} opacityOnTouch={false}>
      <Switch
        style={styles.switch}
        ios_backgroundColor={colors.gray}
        trackColor={{ false: colors.gray, true: colors.orange }}
        thumbColor={colors.white}
        value={value}
        onValueChange={onValueChange}
      />
    </InputContainer>
  );
};

const styles = StyleSheet.create({
  switch: {
    marginBottom: Platform.OS === 'ios' ? 6 : 0,
  },
});
