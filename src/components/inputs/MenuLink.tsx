import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import { GestureResponderEvent, Image, Platform } from 'react-native';
import { Icons } from '../../../assets';

interface MenuLinkProps {
  title: string;
  value?: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export const MenuLink: FunctionComponent<MenuLinkProps> = ({
                                                             title,
                                                             onPress,
                                                             value,
                                                           }) => {
  const icon = Platform.OS === 'ios' ? Icons.chevronRight : Icons.rightArrow;
  const rightItem = <Image source={icon} />;

  return (
    <InputContainer title={title} rightItem={rightItem} onPress={onPress} value={value} />
  );
};
