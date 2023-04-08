import { RouteType } from '@types';
import { allRoutes, ScreenRouteParamList } from '../screens';

const routes: RouteType.RouteObject<ScreenRouteParamList> = {
  ...allRoutes,
};

export const getRoutes = () => {
  let _routes: [string, RouteType.RouteInfo][];

  _routes = Object.entries(routes);

  return {
    routes: _routes.reduce(reduceResultRoute(), []),
  };
};

const reduceResultRoute =
  () =>
  (
    result: RouteType.ResultRoute[],
    [name, routeInfo]: [string, RouteType.RouteInfo],
  ) => {
    routeInfo.type === 'CARD' && result.push({ ...routeInfo, name });
    return result;
  };
