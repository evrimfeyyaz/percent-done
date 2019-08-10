import React, { FunctionComponent, useRef, useState } from 'react';
import { TabItem } from './TabItem';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet } from 'react-native';

/**
 * The distance between the left side of the screen and the
 * selected tab item.
 */
const SELECTED_TAB_ITEM_LEFT_OFFSET = 50;

/**
 * Distance between tab items.
 */
const TAB_ITEM_DISTANCE = 20;

interface TabBarProps {
  tabTitles: string[];
  initialSelectedTabTitle: string;
  /**
   * Called with the title of the pressed tab item when pressed.
   */
  onPress: (pressedTabItemTitle: string) => void;
}

export const TabBar: FunctionComponent<TabBarProps> = ({
                                                         tabTitles,
                                                         initialSelectedTabTitle,
                                                         onPress,
                                                       }) => {
  const [selectedTabItemPositions, setSelectedTabItemPositions] = useState<number[]>([]);
  const [hasCalculatedSelectedTabItemPositions, setHasCalculatedSelectedTabItemPositions] = useState(false);

  const [selectedTabTitle, setSelectedTabTitle] = useState(initialSelectedTabTitle);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleContentSizeChange = async () => {
    if (!hasCalculatedSelectedTabItemPositions) {
      setHasCalculatedSelectedTabItemPositions(true);

      Promise.all(
        tabRefs.map(tabRef => calculateSelectedPositionForTab(tabRef.current)),
      ).then(xPositions => setSelectedTabItemPositions(xPositions));
    }
  };

  const handleTabPress = (title: string) => {
    setSelectedTabTitle(title);

    const scrollView = scrollViewRef.current;
    if (scrollView != null) {
      const pressedTitleIndex = tabTitles.indexOf(title);

      scrollView.scrollTo({ x: selectedTabItemPositions[pressedTitleIndex], y: 0, animated: true });
    }
  };

  const handleScroll = () => {
    const scrollView = scrollViewRef.current;
    if (scrollView != null) {
      const currentTabIndex = tabTitles.indexOf(selectedTabTitle);

      scrollView.scrollTo({ x: selectedTabItemPositions[currentTabIndex + 1], y: 0, animated: true });
    }
  };

  const tabRefs: any[] = [];
  const tabItems = tabTitles.map(title => {
    const tabRef = useRef(null);
    tabRefs.push(tabRef);

    return (
      <TabItem
        title={title}
        active={selectedTabTitle === title}
        style={styles.item}
        key={title}
        onPress={handleTabPress}
        ref={tabRef}
      />
    );
  });

  return (
    <ScrollView
      horizontal
      disableIntervalMomentum={true}
      contentContainerStyle={{ paddingStart: SELECTED_TAB_ITEM_LEFT_OFFSET }}
      decelerationRate='fast'
      showsHorizontalScrollIndicator={false}
      pinchGestureEnabled={false}
      style={styles.container}
      scrollEnabled={false}
      scrollToOverflowEnabled={true}
      onContentSizeChange={handleContentSizeChange}
      ref={scrollViewRef}
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
    marginEnd: TAB_ITEM_DISTANCE,
  },
});

/**
 * Calculates what the x position of the tab item within its view
 * should be for given tab item.
 */
function calculateSelectedPositionForTab(tabItemComponent: any) {
  return new Promise<number>((resolve) => {
    tabItemComponent.measure((x: number) => {
      resolve(x - SELECTED_TAB_ITEM_LEFT_OFFSET);
    });
  });
}
