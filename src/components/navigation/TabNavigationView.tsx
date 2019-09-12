import React from 'react';
import {
  NavigationState,
  NavigationTabRouterConfig,
  NavigationView, SceneView,
} from 'react-navigation';
import { BackgroundView, TabBar, TabInfo } from '..';

export const TabNavigationView: NavigationView<NavigationTabRouterConfig, NavigationState> = ({ navigation, descriptors }) => {
  const onTabChange = (index: number) => {
    const tabTitle = navigation.state.routes[index].routeName;

    navigation.navigate(tabTitle);
  };

  const activeKey = navigation.state.routes[navigation.state.index].key;
  const descriptor = descriptors[activeKey];

  const tabs: TabInfo[] = navigation.state.routes.map(route => ({
    key: route.key,
    title: route.routeName,
  }));

  return (
    <BackgroundView>
      <TabBar selectedIndex={navigation.state.index} tabs={tabs} onTabChange={onTabChange} />
      {/*
      // @ts-ignore */}
      <SceneView navigation={descriptor.navigation} component={descriptor.getComponent()} />
    </BackgroundView>
  );
};
