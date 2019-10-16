import { colors, fonts } from '../theme';
import { NavigationRoute, NavigationScreenConfig } from 'react-navigation';
import { NavigationStackOptions, NavigationStackProp } from 'react-navigation-stack';

export const headerConfig: NavigationScreenConfig<NavigationStackOptions, NavigationStackProp<NavigationRoute, any>> = {
  headerStyle: {
    backgroundColor: colors.offWhite,
  },
  headerTitleStyle: {
    fontFamily: fonts.semibold,
    fontWeight: '600',
    color: colors.offBlack,
    fontSize: 14,
    textTransform: 'uppercase',
  },
};
