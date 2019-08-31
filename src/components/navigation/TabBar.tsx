import React, { FunctionComponent, useState, useEffect } from 'react';
import { TabItem } from './TabItem';
import {
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  View, LayoutChangeEvent,
} from 'react-native';

export interface TabInfo {
  key: string,
  title: string,
}

interface Props {
  tabs: TabInfo[];
  selectedIndex: number;
  onTabChange: (newIndex: number) => void;
}

const SELECTED_TAB_ITEM_LEFT_MARGIN = 50;
const MIN_DRAG_AMOUNT_TO_CHANGE_TABS = 50;

export const TabBar: FunctionComponent<Props> = ({
                                                   selectedIndex,
                                                   tabs,
                                                   onTabChange,
                                                 }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  /**
   * The distance of the tab bar to its original position in the x axis.
   */
  const [translateX] = useState(new Animated.Value(SELECTED_TAB_ITEM_LEFT_MARGIN));

  /**
   * X position each tab item should have when they are selected.
   */
  const [selectedTabPositions, setSelectedTabPositions] = useState<{ [index: number]: number }>({});

  /**
   * Selection status of each tab. 1 means selected, 0 means not selected.
   * Any number between 0 and 1 indicates there is a transition between tabs.
   * This value is used for transition effects between tabs.
   */
  const [tabSelectionStatus, setTabSelectionStatus] = useState<{ [index: number]: Animated.Value }>({});

  /**
   * Returns a config object for the animation used for moving
   * tabs during transitions or a gesture.
   */
  const tabMoveAnimationConfig = (toValue: number) => {
    return {
      toValue,
      duration: 200,
      useNativeDriver: true,
    };
  };

  /**
   * Returns a config object for the animation used for the color
   * change between the selected and the next potential tab item.
   */
  const colorChangeAnimationConfig = (toValue: number) => {
    return {
      toValue,
      duration: 200,
    };
  };

  /**
   * If navigation state and local state don't match, fix it.
   */
  useEffect(() => {
    if (selectedIndex != selectedTabIndex) {
      moveToTab(selectedTabIndex, selectedIndex);
    }
  }, [selectedIndex, tabs]);

  /**
   * Notify listeners when selected tab changes.
   */
  useEffect(() => {
    onTabChange(selectedTabIndex);
  }, [selectedTabIndex]);

  const handleResponderGrant = () => {
    const offset = selectedTabPositions[selectedTabIndex];

    translateX.setOffset(offset);
    translateX.setValue(0);
  };

  const handleResponderMove = Animated.event(
    [],
    // @ts-ignore
    {
      listener: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const potentialTabIndex = getPotentialTabIndex(gestureState.dx);

        if (potentialTabIndex !== selectedTabIndex) {
          const dragRatio = Math.abs(gestureState.dx) / MIN_DRAG_AMOUNT_TO_CHANGE_TABS;
          const selectionStatus = Math.min(dragRatio, 1);
          tabSelectionStatus[potentialTabIndex].setValue(selectionStatus);
          tabSelectionStatus[selectedTabIndex].setValue(1 - selectionStatus);
        }

        translateX.setValue(decelerateDrag(gestureState.dx));
      },
    });

  const handleResponderRelease = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    translateX.flattenOffset();

    const { dx } = gestureState;
    const newSelectedTabIndex = getIndexOfTabToSelect(dx);
    const potentialTabIndex = getPotentialTabIndex(dx);

    if (newSelectedTabIndex !== selectedTabIndex) { // Dragged enough to change tabs.
      moveToTab(selectedTabIndex, newSelectedTabIndex);
    } else { // Failed to drag enough to move to another tab.
      moveToTab(potentialTabIndex, selectedTabIndex);
    }
  };

  const handlePress = (index: number) => {
    moveToTab(selectedTabIndex, index);
  };

  const handleTabLayout = (tabIndex: number, event: LayoutChangeEvent) => {
    const { x } = event.nativeEvent.layout;
    const selectedXPosition = SELECTED_TAB_ITEM_LEFT_MARGIN - x;

    setSelectedTabPositions({ ...selectedTabPositions, [tabIndex]: selectedXPosition });
  };

  const tabItems = tabs.map((tab, index) => {
    const isSelected = index === selectedTabIndex;
    const selectionStatusValue = isSelected ? 1 : 0;

    if (tabSelectionStatus[index] == null) {
      const selectionStatus = new Animated.Value(selectionStatusValue);
      setTabSelectionStatus({ ...tabSelectionStatus, [index]: selectionStatus });
    }

    return <TabItem
      title={tab.title}
      index={index}
      key={tab.key}
      style={styles.item}
      onPress={handlePress}
      onLayout={handleTabLayout}
      disabled={isSelected}
      selectionStatus={tabSelectionStatus[index]}
    />;
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      return dx > 2 || dx < -2 || dy > 2 || dy < -2;
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderGrant: handleResponderGrant,
    onPanResponderMove: handleResponderMove,
    onPanResponderRelease: handleResponderRelease,
    onPanResponderTerminate: handleResponderRelease,
  });

  const moveToTab = (fromIndex: number, toIndex: number) => {
    const toXPosition = selectedTabPositions[toIndex];

    Animated.parallel([
      Animated.timing(tabSelectionStatus[fromIndex], colorChangeAnimationConfig(0)),
      Animated.timing(tabSelectionStatus[toIndex], colorChangeAnimationConfig(1)),
      Animated.timing(translateX, tabMoveAnimationConfig(toXPosition)),
    ]).start(
      () => {
        setSelectedTabIndex(toIndex);
      },
    );
  };

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
   * user's gesture.
   */
  const getIndexOfTabToSelect = (dragAmount: number) => {
    if (dragAmount < MIN_DRAG_AMOUNT_TO_CHANGE_TABS) { // Dragged left, go to next item.
      return Math.min(selectedTabIndex + 1, tabs.length - 1);
    } else if (dragAmount > MIN_DRAG_AMOUNT_TO_CHANGE_TABS) { // Dragged right, go to previous item.
      return Math.max(selectedTabIndex - 1, 0);
    }

    return selectedTabIndex; // Didn't drag far enough.
  };

  /**
   * Returns the index for the item that the user is swiping towards.
   */
  const getPotentialTabIndex = (dragAmount: number) => {
    if (dragAmount < 0) { // Dragging left.
      return Math.min(selectedTabIndex + 1, tabs.length - 1);
    }

    return Math.max(selectedTabIndex - 1, 0);
  };

  const tabBarMoveAmountStyle = { transform: [{ translateX: translateX as unknown as number }] };
  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Animated.View
        style={StyleSheet.flatten([styles.scrollableContainer, tabBarMoveAmountStyle])} {...panResponder.panHandlers}
        hitSlop={{ left: windowWidth, right: windowWidth }}
      >
        {tabItems}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
  },
  scrollableContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    position: 'absolute',
    left: 0,
  },
  item: {
    marginRight: 20,
  },
});
