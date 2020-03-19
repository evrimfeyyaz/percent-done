import { ThunkAction } from 'redux-thunk';
import { StoreState } from '../types';
import { SettingsActionTypes } from './types';

export const signInWithEmailLink = (email: string): ThunkAction<void, StoreState, void, SettingsActionTypes> => {
  return (dispatch, getState) => {
    const actionCodeSettings = {
      url: 'https://percent-done.firebaseapp.com',
      handleCodeInApp: true,
      iOS: {
        bundleId: 'io.evrim.PercentDone',
      },
      android: {
        packageName: 'io.evrim.PercentDone',
        installApp: true,
        minimumVersion: '12',
      },
    };
  };
};
