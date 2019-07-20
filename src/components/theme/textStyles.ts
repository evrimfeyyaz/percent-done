import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';

export const textStyles = StyleSheet.create({
  body: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  info: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 27,
  },
  infoSmall: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 16,
  },
  infoTail: {
    color: colors.gray,
    fontFamily: fonts.semibold,
    fontSize: 12,
    textTransform: 'uppercase',
  }
});