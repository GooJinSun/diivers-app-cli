import AsyncStorage from '@react-native-community/async-storage';
import * as WebBrowser from 'expo-web-browser';

const getMessageFromWebview = async ({ nativeEvent: { data } }) => {
  const _data = JSON.parse(data);

  // 웹에서의 console.log를 앱 터미널에서도 볼 수 있도록
  if (_data) {
    if (_data.type === 'Console') {
      console.info(`[Console From Webview] ${JSON.stringify(_data.data)}`);
    } else {
      console.log(_data);
    }
  }

  switch (_data.actionType) {
    // 브라우저 따로 열어야할 때 (ex. 개인정보처리방침 등)
    case 'OPEN_BROWSER':
      return WebBrowser.openBrowserAsync(_data.url);
    // NOTE: 로컬 스토리지 관리
    case 'SET_ASYNC_STORAGE':
      if (typeof _data.value === 'string') {
        await AsyncStorage.setItem(_data.key, _data.value);
      } else {
        await AsyncStorage.setItem(_data.key, JSON.stringify(_data.value));
      }
      break;
    case 'REMOVE_ASYNC_STORAGE':
      await AsyncStorage.removeItem(_data.key);
      break;
    case 'CLEAR_ASYNC_STORAGE':
      await AsyncStorage.clear();
      break;
    default:
      return;
  }
};

const sendMessageToWebview = (data: any, webViewRef: any) => {
  const message = JSON.stringify(data);
  console.log('sendMessageToWebview');
  console.log(message);
  webViewRef.current.postMessage(message);
};

export default {
  getMessageFromWebview,
  sendMessageToWebview,
};
