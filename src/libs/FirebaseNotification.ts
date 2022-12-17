import { APP_CONSTS } from '@constants';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import LocalNotification from './LocalNotification';

export default (() => {
  let isInitialized = false;
  let token: null | string = null;

  const getToken = async () => {
    token = await messaging().getToken();
    return token;
  };

  /**
   * ios 에서는 foreground 상태에서도 푸시 노티가 발생함.
   * 안드로이드는 발생하지 않아서 로컬 노티를 즉시 띄워줌
   */
  const handleOnMessage = async (
    event: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    console.log('[FirebaseNotification] handle on message', event);

    const { notification, data } = event;

    if (!notification) return;

    /**
     * IOS: 푸시를 누른 시점에 발생하는 이벤트라 바로 네비게이팅
     * Android: 푸시가 발생한 시점에 발생하는 이벤트 & 실제 푸시는 보이지 않기 때문에 로컬 노티로 복사하여 보여줌.
     * 이후 로컬 노티를 누르면 네비게이팅
     */
    if (APP_CONSTS.IS_ANDROID) {
      return LocalNotification.immediate({
        title: notification.title || '',
        body: notification.body || '',
        data,
      });
    }
  };

  /**
   * initialize
   */
  const initialize = async () => {
    if (isInitialized) return;

    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      console.log('[FirebaseNotification] registerDeviceForRemoteMessages');
      messaging().registerDeviceForRemoteMessages();
    }

    messaging().onNotificationOpenedApp((event: any) => {
      console.log('[FirebaseNotification] onNotificationOpenedApp', event);
    });

    messaging().onMessage(handleOnMessage);

    console.log(
      '[FirebaseNotification] start listening remote notification events 👀',
    );

    isInitialized = true;
  };

  const getInitialNotification = () => messaging().getInitialNotification();

  const saveToken = async (userId: number | null) => {
    try {
      const tokenInfos = {
        token: await getToken(),
        deviceOs: Platform.select<'IOS' | 'AD'>({ ios: 'IOS', default: 'AD' }),
      };

      if (userId) {
        console.log('saved user mode push token', tokenInfos.token);
      } else {
        console.log('saved guest mode push token');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateToken = (userId: number | null) => {
    console.log(userId);
    return null;
  };

  const deleteToken = async () => {
    if (!token) {
      return;
    }
  };

  return {
    initialize,
    saveToken,
    updateToken,
    deleteToken,
    getInitialNotification,
  };
})();
