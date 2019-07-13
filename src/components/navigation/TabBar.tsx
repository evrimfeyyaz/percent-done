import React, { FunctionComponent } from 'react';
import { TabItem } from './TabItem';
import { StyleSheet, View } from 'react-native';

interface TabBarProps {
  tabTitles: string[],
  activeTitle: string,
  /**
   * Called with the title of the pressed tab item when pressed.
   */
  onPress: (pressedTabItemTitle: string) => void,
}

export const TabBar: FunctionComponent<TabBarProps> = ({ tabTitles, activeTitle, onPress }) => {
  if (tabTitles == null) return null;

  const tabItems = tabTitles.map((title) =>
    <TabItem title={title} active={activeTitle === title} style={styles.item} key={title} onPress={onPress} />);

  return (
    <View style={styles.container}>
      {tabItems}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    marginEnd: 20,
  },
});