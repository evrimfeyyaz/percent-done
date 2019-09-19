import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export function useEffectAfterInitialRender(effect: EffectCallback, deps?: DependencyList): void {
  const didRender = useRef<boolean>(false);

  useEffect(() => {
    if (didRender.current) {
      effect();
    } else {
      didRender.current = true;
    }
  }, deps);
}
