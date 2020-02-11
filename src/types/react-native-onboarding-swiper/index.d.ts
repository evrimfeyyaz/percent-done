declare module 'react-native-onboarding-swiper' {
  import { FlatListProps, TextStyle, ViewStyle } from 'react-native';

  export interface Page {
    backgroundColor: string;
    image: JSX.Element;
    title: string | JSX.Element | Function;
    subtitle: string | JSX.Element;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
  }

  export interface OnboardingProps {
    pages: Page[];
    bottomBarHighlight?: boolean;
    bottomBarHeight?: number;
    bottomBarColor?: string;
    controlStatusBar?: boolean;
    showSkip?: boolean;
    showNext?: boolean;
    showDone?: boolean;
    showPagination?: boolean;
    onSkip?: Function;
    onDone?: Function;
    skipLabel?: JSX.Element | string;
    nextLabel?: JSX.Element | string;
    containerStyles?: ViewStyle;
    imageContainerStyles?: ViewStyle;
    allowFontScalingText?: boolean;
    allowFontScalingButtons?: boolean;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
    transitionAnimationDuration?: number;
    skipToPage?: number;
    pageIndexCallback?: Function;
    flatlistProps?: FlatListProps<Page>;
    SkipButtonComponent?: JSX.Element | Function;
    DoneButtonComponent?: JSX.Element | Function;
    NextButtonComponent?: JSX.Element | Function;
    DotComponent?: JSX.Element | Function;
  }

  export default class Onboarding extends React.Component<OnboardingProps> {
  }
}
