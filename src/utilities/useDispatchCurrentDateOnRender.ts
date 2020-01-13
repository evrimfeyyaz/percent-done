import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentDateTimestamp } from '../store/settings/actions';

export function useDispatchCurrentDateOnRender() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentDateTimestamp(Date.now()));
  }, []);
}
