import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import Storybook from './storybook';
import { AppState, AppStateStatus, Platform, UIManager, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { momentWithDeviceLocale, NavigationService } from './src/utilities';
import { AppContainer } from './src/navigators/AppContainer';
import configureStore from './src/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { setCurrentDateTimestamp } from './src/store/settings/actions';

YellowBox.ignoreWarnings([
  'Warning:',
  'VirtualizedLists should never be nested',
  'Story with id',
  '`-[RCTRootView cancelTouches]`',
]);

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// export default Storybook;

const { store, persistor } = configureStore();

const App: FunctionComponent = () => {
  const appState = useRef(AppState.currentState);
  const [dayChangeTimeoutId, setDayChangeTimeoutId] = useState();
  const [loaded, setLoaded] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  useEffect(() => {
    setCurrentTimestamp(Date.now());
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  useEffect(() => {
    const { id, startTimestamp } = store.getState().goals.trackedGoal;

    if (id != null && startTimestamp != null) {
      NavigationService.navigate('TrackGoal', {});
    }
  }, [loaded]);

  useEffect(() => {
    updateCurrentDateAndSetTimeoutForTheNextDay();
  }, [currentTimestamp]);

  const updateCurrentDateAndSetTimeoutForTheNextDay = () => {
    store.dispatch(setCurrentDateTimestamp(currentTimestamp));

    clearTimeout(dayChangeTimeoutId);

    const msUntilTomorrow = +momentWithDeviceLocale(currentTimestamp)
      .add(1, 'day')
      .startOf('day')
      .subtract(currentTimestamp);

    setDayChangeTimeoutId(
      setTimeout(() => {
        setCurrentTimestamp(Date.now());
      }, msUntilTomorrow),
    );
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      setCurrentTimestamp(Date.now());
    }

    appState.current = nextAppState;
  };

  const handleFirstLoad = () => {
    setLoaded(true);
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContainer ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
                      onNavigationStateChange={handleFirstLoad} />
      </PersistGate>
    </Provider>
  );
};
export default App;
