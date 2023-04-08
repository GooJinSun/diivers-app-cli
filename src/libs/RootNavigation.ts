import { createNavigationContainerRef } from '@react-navigation/native';

type RootStackParamList = {
  AppScreen: { url: string };
};

export default () => {
  const navigationRef = createNavigationContainerRef<RootStackParamList>();
  const navigate = (name: keyof RootStackParamList, params: any) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    }
  };
  return {
    navigate,
  };
};
