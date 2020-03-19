import thunk, { ThunkDispatch } from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { StoreState } from '../../../src/store/types';
import { AnyAction } from 'redux';

const middlewares = [thunk];
const mockStore = configureStore<StoreState, ThunkDispatch<StoreState, undefined, AnyAction>>(middlewares);

describe('settings thunks', () => {
  describe('signInWithEmailLink', () => {

  });
});
