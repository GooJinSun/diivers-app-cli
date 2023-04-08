import React, { useCallback, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getRoutes } from './routes';
import { useAppStateEffect, useWebView } from '@hooks';
import { FcmTokenStorage, registerFCMToken, TokenStorage } from '@tools';

const RootNavigator = () => {
  const { postMessage } = useWebView();

  const { routes } = useMemo(() => getRoutes(), []);

  useAppStateEffect(
    useCallback(
      async (state) => {
        if (state === 'active' || state === 'unknown') {
          // 로컬 스토리지에서 token 확인 후 postMessage
          const token = await TokenStorage.getToken();
          postMessage('SET_TOKEN', token);

          // 로컬 스토리지에서 FCM token 확인 후 있으면 서버에 등록
          const { fcmToken } = await FcmTokenStorage.getToken();
          if (!fcmToken || !token.access || !token.refresh) return;
          await registerFCMToken(fcmToken, true);
        }
      },
      [postMessage],
    ),
    [],
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {routes.map(({ name, Component, initialParams, options }) => (
        <Stack.Screen
          key={name}
          name={name}
          component={Component}
          initialParams={{ ...initialParams }}
          options={options}
        />
      ))}
    </Stack.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default RootNavigator;
