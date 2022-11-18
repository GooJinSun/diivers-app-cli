import { useCallback, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { WebViewMessageEvent, WebView } from 'react-native-webview';
import { WebViewProgressEvent } from 'react-native-webview/lib/WebViewTypes';
import { TokenStorage } from '../tools/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useWebView = () => {
  const [loadProgress, setLoadProgress] = useState(0);
  const ref = useRef<WebView>(null);

  const postMessage = useCallback(
    (data: any) => {
      ref.current?.postMessage(JSON.stringify(data));
    },
    [ref],
  );

  /**
   * 웹뷰에서 오는 요청 처리
   */
  const onMessage = useCallback(async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (!('actionType' in data)) return;
    if (data.actionType === 'CONSOLE') console.log(data.data);

    switch (data.actionType) {
      case 'OPEN_BROWSER':
        //TODO(Gina): 나중에 가능하다면 openBrowserAsync 사용해보기
        await Linking.openURL(data.url);
        return;
      case 'SET_TOKEN': {
        const { refresh = '', access = '' } = data.token;
        await TokenStorage.setToken({
          refresh,
          access,
        });
        return;
      }
      case 'REMOVE_TOKEN': {
        await TokenStorage.removeToken();
        return;
      }
      //NOTE(Gina): 아래는 AsyncStorage 관련 util들이며, 만약 쓰이지 않는다면 지워두기 (22.11.19)
      case 'SET_ASYNC_STORAGE':
        if (typeof data.value === 'string') {
          await AsyncStorage.setItem(data.key, data.value);
        } else {
          await AsyncStorage.setItem(data.key, JSON.stringify(data.value));
        }
        break;
      case 'REMOVE_ASYNC_STORAGE':
        await AsyncStorage.removeItem(data.key);
        break;
      case 'CLEAR_ASYNC_STORAGE':
        await AsyncStorage.clear();
        break;
      default:
        return;
    }
  }, []);

  const onLoadProgress = useCallback((e: WebViewProgressEvent) => {
    setLoadProgress(e.nativeEvent.progress);
  }, []);

  return {
    ref,
    loadProgress,
    onMessage,
    onLoadProgress,
    postMessage,
  };
};

export default useWebView;
