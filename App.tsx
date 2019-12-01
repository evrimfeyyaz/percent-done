import React, { FunctionComponent, useEffect } from 'react';
import Storybook from './storybook';
import { Platform, UIManager, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationService } from './src/utilities';
import { AppContainer } from './src/navigators/AppContainer';
import configureStore from './src/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';

YellowBox.ignoreWarnings(['Warning:']);
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// export default Storybook;

const { store, persistor } = configureStore();

const App: FunctionComponent = () => {
  useEffect(() => {
    const { id, startTimestamp } = store.getState().goals.trackedGoal;

    if (id != null && startTimestamp != null) {
      NavigationService.navigate('TrackGoal', {});
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AppContainer ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)} />
      </PersistGate>
    </Provider>
  );
};
export default App;
