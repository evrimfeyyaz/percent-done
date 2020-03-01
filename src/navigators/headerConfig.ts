import { colors, fonts } from '../theme';
import { NavigationRoute, NavigationScreenConfig } from 'react-navigation';
import { NavigationStackOptions, NavigationStackProp } from 'react-navigation-stack';
import { Platform } from 'react-native';

export const headerConfig: NavigationScreenConfig<NavigationStackOptions, NavigationStackProp<NavigationRoute, any>> = {
  headerStyle: {
    backgroundColor: colors.offWhite,
  },
  headerTitleContainerStyle: {
    width: Platform.OS === 'ios' ? '60%' : '75%',
    alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start',
  },
  headerTitleStyle: {
    fontFamily: fonts.semibold,
    fontWeight: '600',
    color: colors.offBlack,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  headerBackTitleStyle: {
    fontFamily: fonts.semibold,
    fontWeight: '600',
    color: colors.offBlack,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  headerTintColor: colors.offBlack,
};
