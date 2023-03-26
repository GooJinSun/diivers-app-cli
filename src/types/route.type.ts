import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ScreenParamList } from '@screens';

export type ScreenOptions = {
  options?: NativeStackNavigationOptions;
  initialParams?: Record<string, unknown>;
  initialRoute?: boolean;
};

export type RoutesParamsList = ScreenParamList;

export type RouteKeys = keyof RoutesParamsList;

export type InitialRoute = {
  screeName: RouteKeys | undefined;
  screenParams: RoutesParamsList[RouteKeys] | undefined;
};

export type MessageRoute = {
  screenName: RouteKeys;
  screenParams?: {
    [key: string]: any;
  };
};
