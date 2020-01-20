import { Dimensions } from 'react-native';

export function isScreenSmall() {
  return Dimensions.get('window').width <= 320;
}
