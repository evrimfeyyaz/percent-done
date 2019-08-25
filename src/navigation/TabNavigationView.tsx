import * as React from 'react';
import {
  NavigationState,
  NavigationTabRouterConfig,
  NavigationView, SceneView,
} from 'react-navigation';
import { BackgroundView, TabBar } from '../components';

export const TabNavigationView: NavigationView<NavigationTabRouterConfig, NavigationState> = ({ navigation, descriptors }) => {
  const onTabChange = (index: number) => {
    const tabTitle = navigation.state.routes[index].routeName;

    navigation.navigate(tabTitle);
  };

  const activeKey = navigation.state.routes[navigation.state.index].key;
  const descriptor = descriptors[activeKey];


  return (
    <BackgroundView>
      <TabBar navigationState={navigation.state} onTabChange={onTabChange} />
      {/*
      // @ts-ignore */}
      <SceneView navigation={descriptor.navigation} component={descriptor.getComponent()} />
    </BackgroundView>
  );
};
