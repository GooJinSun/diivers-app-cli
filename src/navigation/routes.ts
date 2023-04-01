import { tsUtils } from '@utils';
import * as routes from '../screens';

export const getRoutes = () => {
  const allRoutes = tsUtils.typedObjectKeys(routes).map((key) => ({
    name: key,
    ...routes[key],
  }));

  return {
    routes: allRoutes,
  };
};

export const allRouteKeys = tsUtils.typedObjectKeys(routes);
