import React, { useCallback } from 'react';
import { AppState, Platform, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { WEBVIEW_CONSTS } from '@constants';
import { useWebView, useAsyncEffect } from '@hooks';
import { TokenStorage, FcmTokenStorage } from '@tools';
import BootSplash from 'react-native-bootsplash';
import { FirebaseNotification } from '@libs';
import { fcmApis } from '@apis';

// const WEB_VIEW_URL = 'http://192.168.0.101:3000';
const WEB_VIEW_URL = 'https://diivers.world';

const WebViewScreen: React.FC = () => {
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
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        ref={ref}
        onMessage={onMessage}
        source={{ uri: WEB_VIEW_URL }}
        decelerationRate="normal"
        javaScriptEnabled
        injectedJavaScript={WEBVIEW_CONSTS.WEB_VIEW_DEBUGGING_SCRIPT}
        originWhitelist={['*']}
        style={{
          flex: 1,
        }}
      />
    </SafeAreaView>
  );
};

export default WebViewScreen;
