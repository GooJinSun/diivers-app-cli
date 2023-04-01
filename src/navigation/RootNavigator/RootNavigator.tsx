import React, { useLayoutEffect, useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getRoutes } from '../routes';
import { useAsyncEffect } from '@hooks';
import { FcmTokenStorage } from '@tools';
import { FirebaseNotification } from '@libs';
import BootSplash from 'react-native-bootsplash';

const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);

  const { routes } = useMemo(() => getRoutes(), []);

  useLayoutEffect(() => {
    // 맨 처음에 해주면 좋은 동작들
  }, []);

  useAsyncEffect(async () => {
    try {
      await FirebaseNotification.initialize();
      await FirebaseNotification.requestUserPermission();
      // 맨 처음에 FCM 토큰 무조건 로컬 스토리지에 저장
      const fcmToken = await FirebaseNotification.getToken();
      await FcmTokenStorage.setToken({
        fcmToken,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setInitializing(false);
      // bootsplash 가리기
      await BootSplash.hide({ fade: true });
    }
  }, []);

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
