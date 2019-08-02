import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { TabItem } from './TabItem';
import { findNodeHandle, ScrollView, StyleSheet, Text } from 'react-native';

interface TabBarProps {
  tabTitles: string[];
  activeTitle: string;
  /**
   * Called with the title of the pressed tab item when pressed.
   */
  onPress: (pressedTabItemTitle: string) => void;
}

export const TabBar: FunctionComponent<TabBarProps> = ({
                                                         tabTitles,
                                                         activeTitle,
                                                         onPress,
                                                       }) => {
  const [tabItemXPositions, setTabItemXPositions] = useState<number[]>([]);

  const tabRefs: any[] = [];
  const tabItems = tabTitles.map(title => {
    const tabRef = useRef(null);
    tabRefs.push(tabRef);

    return (
      <TabItem
        title={title}
        active={activeTitle === title}
        style={styles.item}
        key={title}
        onPress={onPress}
        ref={tabRef}
      />
    );
  });

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ paddingStart: 50 }}
      snapToOffsets={tabItemXPositions}
      snapToEnd={false}
      showsHorizontalScrollIndicator={false}
      pinchGestureEnabled={false}
      style={styles.container}
    >
      {tabItems}
    </ScrollView>
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
