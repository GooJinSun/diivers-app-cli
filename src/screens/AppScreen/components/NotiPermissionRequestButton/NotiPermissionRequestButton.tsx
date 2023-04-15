import { APP_CONSTS } from '@constants';
import React from 'react';
import {
  Image,
  Linking,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const NotiPermissionRequestButton: React.FC = () => {
  // 설정 화면으로 이동
  const handlePress = () => {
    if (APP_CONSTS.IS_ANDROID) Linking.openURL('App-Prefs:root');
    else Linking.openURL('app-settings:');
  };

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 14,
        backgroundColor: '#f12c56',
        bottom: 100,
        left: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        position: 'absolute',
      }}
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../../../../assets/icons/noti_white.png')}
            style={{
              width: 12,
              height: 12,
              marginRight: 2,
            }}
          />
          <Text style={{ color: 'white', fontSize: 13, textAlign: 'center' }}>
            알림 권한 허용
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default NotiPermissionRequestButton;
