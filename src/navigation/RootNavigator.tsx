import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getRoutes } from './routes';
import { useAppStateEffect, useAsyncEffect, useWebView } from '@hooks';
import { FcmTokenStorage, registerFCMToken, TokenStorage } from '@tools';
import { FirebaseNotification } from '@libs';
import BootSplash from 'react-native-bootsplash';

const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const { postMessage } = useWebView();

  console.log('RootNavigator');

  const { routes } = useMemo(() => getRoutes(), []);

  useLayoutEffect(() => {
    // 맨 처음에 해주면 좋은 동작들 (동기)
    FirebaseNotification.initialize();
    FirebaseNotification.requestUserPermission();
  }, []);

  useAsyncEffect(async () => {
    try {
      // 맨 처음에 FCM 토큰 무조건 로컬 스토리지에 저장 후 서버에 전송
      const fcmToken = await FirebaseNotification.getToken();
      await FcmTokenStorage.setToken({
        fcmToken,
      });
      await registerFCMToken(fcmToken, true);
    } catch (error) {
      console.log(error);
    } finally {
      setInitializing(false);
      await BootSplash.hide({ fade: true });
    }
  }, []);

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

  if (initializing) return <></>;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {routes.map(({ name, Component }) => (
        <Stack.Screen key={name} name={name} component={Component} />
      ))}
    </Stack.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default RootNavigator;
