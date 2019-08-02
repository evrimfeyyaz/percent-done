import React, { FunctionComponent } from 'react';
import { InputContainer } from './InputContainer';
import { GestureResponderEvent, Image } from 'react-native';
import { Icons } from '../../../assets';

interface MenuLinkProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export const MenuLink: FunctionComponent<MenuLinkProps> = ({
                                                             title,
                                                             onPress,
                                                           }) => {
  const rightItem = <Image source={Icons.chevronRight} />;

  return (
    <InputContainer title={title} rightItem={rightItem} onPress={onPress} />
  );
};
