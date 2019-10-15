import {
  NavigationActions,
  NavigationContainerComponent,
  NavigationParams,
} from 'react-navigation';

let navigator: NavigationContainerComponent;

function setTopLevelNavigator(navigatorRef: NavigationContainerComponent | null) {
  if (navigatorRef == null) return;

  navigator = navigatorRef;
}

function navigate(routeName: string, params: NavigationParams) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function goBack() {
  navigator.dispatch(
    NavigationActions.back(),
  );
}

export const NavigationService = {
  navigate,
  goBack,
  setTopLevelNavigator,
};
