import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentDateTimestamp } from '../store/settings/actions';

export function useDispatchCurrentDateOnRender() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('dispatching new date from effect');
    dispatch(setCurrentDateTimestamp(Date.now()));
  }, []);
}
