import React, { FunctionComponent, useRef, useState, useEffect, MutableRefObject } from 'react';
import { TabItem } from './TabItem';
import {
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

interface TabBarProps {
  tabTitles: string[];
  initialSelectedTabIndex: number;
  onPress: (pressedTabItemTitle: string) => void;
}

const SELECTED_TAB_ITEM_LEFT_MARGIN = 50;

export const TabBar: FunctionComponent<TabBarProps> = ({
                                                         tabTitles,
                                                         initialSelectedTabIndex = 0,
                                                         onPress,
                                                       }) => {
  /**
   * X position each tab item should have when they are selected.
   */
  const [tabItemXPositionsWhenSelected, setTabItemXPositionsWhenSelected] = useState<number[]>([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(initialSelectedTabIndex);
  /**
   * The distance of the tab bar to its original position in the x axis.
   */
  const [tabBarMoveAmount] = useState(new Animated.Value(0));

  useEffect(() => { // Calculate tab item x positions.
    const measurePromises = tabItemRefs.map(ref => new Promise<number>(resolve => {
      if (ref.current != null) {
        ref.current.measure((x: number) => resolve(x));
      }
    }));

    Promise.all(measurePromises).then(xPositions => {
      const selectedXPositions = xPositions.map(xPosition => SELECTED_TAB_ITEM_LEFT_MARGIN - xPosition);
      setTabItemXPositionsWhenSelected(selectedXPositions);
    });
  }, []);

  useEffect(() => { // Animate tab changes.
    if (tabItemXPositionsWhenSelected[selectedTabIndex] == null) return;

    Animated.spring(
      tabBarMoveAmount,
      {
        toValue: tabItemXPositionsWhenSelected[selectedTabIndex],
        overshootClamping: true,
      }).start();
  });

  const handleResponderGrant = () => {
    const tabBarMoveAmountOffset = tabItemXPositionsWhenSelected[selectedTabIndex];

    tabBarMoveAmount.setOffset(tabBarMoveAmountOffset);
    tabBarMoveAmount.setValue(0);
  };

  const handleResponderMove = Animated.event(
    [],
    // @ts-ignore
    {
      listener: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        tabBarMoveAmount.setValue(decelerateDrag(gestureState.dx));
      },
    });

  const handleResponderRelease = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    tabBarMoveAmount.flattenOffset();

    const newSelectedTabIndex = getSelectedTabIndexByDragAmount(gestureState.dx);

    if (selectedTabIndex === newSelectedTabIndex) {
      Animated.spring(tabBarMoveAmount, { toValue: tabItemXPositionsWhenSelected[selectedTabIndex] }).start();
    } else {
      setSelectedTabIndex(newSelectedTabIndex);

      const newSelectedTabTitle = tabTitles[newSelectedTabIndex];
      onPress(newSelectedTabTitle);
    }
  };

  const handleTabPress = (title: string) => {
    const tabItemIndex = tabTitles.indexOf(title);

    setSelectedTabIndex(tabItemIndex);
    onPress(title);
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

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderGrant: handleResponderGrant,
    onPanResponderMove: handleResponderMove,
    onPanResponderRelease: handleResponderRelease,
    onPanResponderTerminate: handleResponderRelease,
  });

  /**
   * As the user pulls beyond the bounds at a point, slowly decelerates
   * the drag, creating an illusion of being pulled from the opposite
   * direction.
   */
  const decelerateDrag = (dragAmount: number) => {
    const windowWidth = Dimensions.get('window').width;
    const decelerationSpeed = 3; // The larger the number, the faster the deceleration.

    if (dragAmount < 0) { // Dragging to left.
      return dragAmount * (1 - (Math.atan(-dragAmount / windowWidth) / (Math.PI / decelerationSpeed)));
    }

    return dragAmount * (1 - (Math.atan(dragAmount / windowWidth) / (Math.PI / decelerationSpeed)));
  };

  /**
   * Returns the index for the item that we should move to based on
   * the way user drags the tab bar.
   */
  const getSelectedTabIndexByDragAmount = (dragAmount: number) => {
    const minDragAmount = 50;

    if (dragAmount < -minDragAmount) { // Dragged left, go to next item.
      return Math.min(selectedTabIndex + 1, tabTitles.length - 1);
    } else if (dragAmount > minDragAmount) { // Dragged right, go to previous item.
      return Math.max(selectedTabIndex - 1, 0);
    }

    return selectedTabIndex; // Didn't drag far enough.
  };

  const tabBarMoveAmountStyle = { transform: [{ translateX: tabBarMoveAmount as unknown as number }] };

  return (
    <Animated.View style={StyleSheet.flatten([styles.container, tabBarMoveAmountStyle])} {...panResponder.panHandlers}>
      {tabItems}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    paddingRight: Dimensions.get('window').width * 2, // Extra space at the right end so the user can drag beyond the tab items. Bit hacky.
    paddingLeft: SELECTED_TAB_ITEM_LEFT_MARGIN, // Left padding so the user can drag beyond the first tab item. Again, bit hacky.
  },
  item: {
    marginRight: 20,
  },
});
