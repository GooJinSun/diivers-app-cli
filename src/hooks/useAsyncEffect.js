import React from 'react';

export const useAsyncEffect = (func: Function, dependency: Array<any>) => {
  React.useEffect(() => {
    (async () => {
      await func();
    })();
  }, [func, dependency]);
};
