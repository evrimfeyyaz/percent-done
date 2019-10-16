import { applyMiddleware, combineReducers, createStore } from 'redux';
import { goalsReducer } from './goals/reducers';
import { timetableEntriesReducer } from './timetableEntries/reducers';
import seedData from '../../seedData';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

export default function configureStore() {
  const rootReducer = combineReducers({
    goals: goalsReducer,
    timetableEntries: timetableEntriesReducer,
  });

  const preloadedState = __DEV__ ? seedData : undefined;

  return createStore(rootReducer, preloadedState, composeWithDevTools(applyMiddleware(thunk)));
}
