import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentDateTimestamp } from '../store/settings/actions';

/**
 * This hook updates the date every time the component
 * that it is used in is mounted.
 */
export function useDispatchCurrentDateOnRender() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentDateTimestamp(Date.now()));
  }, []);
}
