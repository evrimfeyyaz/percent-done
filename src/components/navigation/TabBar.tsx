import React, { FunctionComponent, useRef, useState, useEffect, MutableRefObject } from 'react';
import { TabItem } from './TabItem';
import { StyleSheet, View, Animated, Dimensions, PanResponder } from 'react-native';

interface TabBarProps {
  tabTitles: string[];
  initialSelectedTabIndex: number;
  /**
   * Called with the tabTitle of the pressed tab item when pressed.
   */
  onPress: (pressedTabItemTitle: string) => void;
}

export const TabBar: FunctionComponent<TabBarProps> = ({
                                                         tabTitles,
                                                         initialSelectedTabIndex = 0,
                                                         onPress,
                                                       }) => {
  const [tabItemXPositions, setTabItemXPositions] = useState<number[]>([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(initialSelectedTabIndex);

  useEffect(() => { // Calculate tab item X positions.
    const measurePromises = tabItemRefs.map(ref => new Promise<number>(resolve => {
      if (ref.current != null) {
        ref.current.measure((x: number) => resolve(x));
      }
    }));

    Promise.all(measurePromises).then(xPositions => setTabItemXPositions(xPositions));
  }, []);

  const handleTabPress = (title: string) => {
    const tabItemIndex = tabTitles.indexOf(title);

    setSelectedTabIndex(tabItemIndex);
  };

  /**
   * Returns the amount of points the tab bar should be moved in
   * x axis based on the selected tab item.
   */
  const getTabBarMoveAmount = () => {
    const selectedTabItemXPosition = tabItemXPositions[selectedTabIndex];

    if (selectedTabItemXPosition != null) {
      return 50 - tabItemXPositions[selectedTabIndex];
    }

    return 50;
  };

  const tabItemRefs: MutableRefObject<any>[] = [];
  const tabItems = tabTitles.map((tabTitle, index) => {
    const ref = useRef(null);
    tabItemRefs.push(ref);

    return <TabItem
      title={tabTitle}
      active={index === selectedTabIndex}
      key={tabTitle}
      style={styles.item}
      onPress={handleTabPress}
      ref={ref}
    />;
  });

  const tabBarMoveAmountStyle = { transform: [{ translateX: getTabBarMoveAmount() }] };

  return (
    <View style={StyleSheet.create([styles.container, tabBarMoveAmountStyle])}>
      {tabItems}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
  },
  item: {
    marginRight: 20,
  },
});
