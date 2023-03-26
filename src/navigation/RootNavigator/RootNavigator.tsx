import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getRoutes } from '../routes';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { RouteType } from '@types';

const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);

  const [initialRoute, setInitialRoute] = useState<RouteType.InitialRoute>({
    screeName: undefined,
    screenParams: undefined,
  });

  const { routes } = useMemo(() => getRoutes(), []);

  useLayoutEffect(() => {
    // 맨 처음에 해주면 좋은 동작들
    // initializeFirebaseMessage();
  }, []);

  useAsyncEffect(async () => {
    try {
      // 유저 관련 동작
      // const me = await signIn();
      setInitialRoute({
        screeName: 'AppScreen',
        screenParams: undefined,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setInitializing(false);
      // bootsplash 가리기
      // await BootSplash.hide({ fade: true });
    }
  }, []);

  useEffect(() => {
    // MessageNavigate
    // if (initializing) return;
    // const subscription = MessageNavigate.subscribe(navigateOnMessage);
    // return () => subscription.unsubscribe();
  }, [initializing]);

  if (initializing) return <></>;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {routes.map(({ name, Component }) => (
        <Stack.Screen
          key={name}
          name={name}
          // options={options}
          initialParams={initialRoute.screenParams}
          component={Component}
        />
      ))}
    </Stack.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default RootNavigator;
