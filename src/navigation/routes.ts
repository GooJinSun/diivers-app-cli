import * as routes from '../screens';
import { typedObjectKeys } from '@utils/ts';

export const getRoutes = () => {
  const allRoutes = typedObjectKeys(routes).map((key) => ({
    name: key,
    ...routes[key],
  }));

  return {
    routes: allRoutes,
  };
};

export const allRouteKeys = typedObjectKeys(routes);
