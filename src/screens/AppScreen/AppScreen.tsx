import React, { useCallback } from 'react';
import { AppState, Platform, SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import BootSplash from 'react-native-bootsplash';
import FirebaseNotification from '@libs/FirebaseNotification';
import useWebView from '@hooks/useWebView';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { WEBVIEW_CONSTS } from '@constants';
import { fcmApis } from '@apis';
import { TokenStorage, FcmTokenStorage } from '@tools';

export type AppScreenProps = {
  // add props
};

const AppScreen: React.FC<AppScreenProps> = () => {
  const { ref, postMessage, onMessage } = useWebView();

  useAsyncEffect(async () => {
    await FirebaseNotification.initialize();
    await FirebaseNotification.requestUserPermission();
    // 맨 처음에 FCM 토큰 무조건 로컬 스토리지에 저장
    const fcmToken = await FirebaseNotification.getToken();
    await FcmTokenStorage.setToken({
      fcmToken,
    });
  }, []);

  // 유저의 FCM 토큰 저장 (api 호출)
  const handleRegisterFCMToken = useCallback(
    async (fcmToken: string, isActive: boolean) => {
      await fcmApis.registerFCMToken({
        type: Platform.OS === 'android' ? 'android' : 'ios',
        registration_id: fcmToken,
        active: isActive,
      });
      // 안전성을 위해 다시 한번 로컬 스토리지에 저장해줌
      await FcmTokenStorage.setToken({
        fcmToken,
      });
    },
    [],
  );

  // 이전이 어느 상태였던 foreground로 돌아왔을때 필요한 동작들
  useAsyncEffect(async () => {
    const state = AppState.currentState;

    if (state === 'active' || state === 'unknown') {
      // 로컬 스토리지에서 토큰 확인
      const token = await TokenStorage.getToken();
      await BootSplash.hide({ fade: true });
      postMessage('SET_TOKEN', token);

      // 로컬 스토리지에서 FCM 토큰 확인 -> 있으면 api 등록
      const { fcmToken } = await FcmTokenStorage.getToken();
      if (!fcmToken || !token.access || !token.refresh) return;
      await handleRegisterFCMToken(fcmToken, true);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      <WebView
        ref={ref}
        onMessage={onMessage}
        source={{ uri: WEBVIEW_CONSTS.WEB_VIEW_URL.PROD }}
        decelerationRate="normal"
        javaScriptEnabled
        injectedJavaScript={WEBVIEW_CONSTS.WEB_VIEW_DEBUGGING_SCRIPT}
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
};

export default {
  Component: AppScreen,
};
