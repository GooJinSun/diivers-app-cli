import { useEffect } from 'react';
import { AppState } from 'react-native';

// 앱 상태가 background -> foreground (active) 일때 사용할 수 있는 hook
const useAppStateActiveEffect = (effect: () => Promise<void> | void) => {
  useEffect(() => {
    const { remove } = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      effect();
    });
    return () => {
      remove();
    };
  }, [effect]);
};

export default useAppStateActiveEffect;
