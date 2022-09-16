# adoor-app-cli

adoor의 모바일 앱을 위한 react-native 프로젝트

## 1. Environment Setting (TBU)

1. Android Studio 설치 및 SDK 설정 (for Android)
- Target OS에서 Android 선택 후 진행 
- [공식 문서](https://reactnative.dev/docs/environment-setup#installing-dependencies)

2. Xcode 및 cocoapods 설치 (for IOS)
`sudo gem install cocoapods`
- Target OS에서 iOS 선택 후 진행 
- [공식 문서](https://reactnative.dev/docs/environment-setup#installing-dependencies)

## 2. Run (Simulator)

- Android
```
yarn android
```

- IOS
```
yarn ios
```

아무 기기도 연결하지 않고 run하면 바로 simulator(emulator)로 실행됨

## 3. Run (Device)
실제 기기로 연결해서 run하는 방법

- Android

[참고 공식 문서](https://reactnative.dev/docs/0.62/running-on-device#running-your-app-on-android-devices)
1. USB로 노트북과 안드로이드 기기 연결 (이때, 안드로이드 기기에서 USB debugging를 켜주셔야 합니다!)
2. 잘 연결되었는지 확인하려면 adb devices로 확인
```
$ adb devices
List of devices attached
emulator-5554 offline   # Google emulator
14ed2fcc device         # Physical device
```
3. 그리고 run!
```
yarn android
```

- IOS

[참고 공식 문서](https://reactnative.dev/docs/0.62/running-on-device#running-your-app-on-ios-devices)
1. USB로 노트북과 IOS 기기 연결
2. 그리고 run!
```
yarn ios
```
(만약 처음 ios 기기로 run해보는거면 위에 단 링크에 들어가서 차근차근 하나씩 따라해보시는게 좋을 것 같아요)

## 3. Trouble Shooting 
- 나중에 관련 Trouble Shooting 생기면 추가해두겠습니다!
