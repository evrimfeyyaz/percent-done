import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatchCurrentDateOnRender } from '../../utilities';
import { CurrentStats } from '../../containers';

export const StatsScreen: NavigationStackScreenComponent = () => {
  useDispatchCurrentDateOnRender();

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} alwaysBounceVertical={false}>
      <CurrentStats />
    </ScrollView>
  );
};

StatsScreen.navigationOptions = {
  title: 'Stats',
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'stretch',
    flexGrow: 1,
  },
});
