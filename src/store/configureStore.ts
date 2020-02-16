import { applyMiddleware, combineReducers, createStore } from 'redux';
import { goalsReducer } from './goals/reducers';
import { timetableEntriesReducer } from './timetableEntries/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { PersistConfig } from 'redux-persist/es/types';
import { StoreState } from './types';
import { projectsReducer } from './projects/reducers';
import { settingsReducer } from './settings/reducers';
import { storeMigrations } from './storeMigrations';

export default function configureStore() {
  const rootReducer = combineReducers({
    goals: goalsReducer,
    timetableEntries: timetableEntriesReducer,
    projects: projectsReducer,
    settings: settingsReducer,
  });

  const persistConfig: PersistConfig<StoreState> = {
    key: 'root',
    version: 0,
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
    // @ts-ignore
    migrate: createMigrate(storeMigrations),
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, undefined, composeWithDevTools(applyMiddleware(thunk)));
  const persistor = persistStore(store);

  return { store, persistor };
}
