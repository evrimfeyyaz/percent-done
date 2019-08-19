import React, { FunctionComponent, useRef, useState, useEffect, MutableRefObject } from 'react';
import { TabItem } from './TabItem';
import {
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  View, ScrollView,
} from 'react-native';
import { NavigationState } from 'react-navigation';

interface TabBarProps {
  navigationState: NavigationState
  onTabChange: (newTabTitle: string) => void;
}

const SELECTED_TAB_ITEM_LEFT_MARGIN = 50;

export const TabBar: FunctionComponent<TabBarProps> = ({
                                                         navigationState,
                                                         onTabChange,
                                                       }) => {
  /**
   * X position each tab item should have when they are selected.
   */
  const [tabItemXPositionsWhenSelected, setTabItemXPositionsWhenSelected] = useState<number[]>([]);
  /**
   * The distance of the tab bar to its original position in the x axis.
   */
  const [tabBarMoveAmount] = useState(new Animated.Value(SELECTED_TAB_ITEM_LEFT_MARGIN));

  useEffect(() => { // Calculate tab item x positions.
    const measurePromises = tabItemRefs.map(ref => new Promise<number>(resolve => {
      if (ref.current != null) {
        ref.current.measure((x: number) => resolve(x));
      }
    }));

    Promise.all(measurePromises).then(xPositions => {
      const selectedXPositions = xPositions.map(xPosition => SELECTED_TAB_ITEM_LEFT_MARGIN - xPosition);
      setTabItemXPositionsWhenSelected(selectedXPositions);
      console.log(selectedXPositions);
    });
  }, [navigationState]);

  useEffect(() => { // Animate tab changes.
    if (tabItemXPositionsWhenSelected[navigationState.index] == null) return;

    Animated.spring(
      tabBarMoveAmount,
      {
        toValue: tabItemXPositionsWhenSelected[navigationState.index],
        overshootClamping: true,
      }).start();
  });

  const handleResponderGrant = () => {
    const tabBarMoveAmountOffset = tabItemXPositionsWhenSelected[navigationState.index];

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

    if (navigationState.index === newSelectedTabIndex) {
      Animated.spring(tabBarMoveAmount, { toValue: tabItemXPositionsWhenSelected[navigationState.index] }).start();
    } else {
      const newTabTitle = navigationState.routes[newSelectedTabIndex].routeName;

      onTabChange(newTabTitle);
    }
  };

  const tabItemRefs: MutableRefObject<any>[] = [];
  const tabItems = navigationState.routes.map((route, index) => {
    const ref = useRef(null);
    tabItemRefs.push(ref);

    return <TabItem
      title={route.routeName}
      active={index === navigationState.index}
      key={route.key}
      style={styles.item}
      onPress={onTabChange}
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
      return Math.min(navigationState.index + 1, navigationState.routes.length - 1);
    } else if (dragAmount > minDragAmount) { // Dragged right, go to previous item.
      return Math.max(navigationState.index - 1, 0);
    }

    return navigationState.index; // Didn't drag far enough.
  };

  const tabBarMoveAmountStyle = { transform: [{ translateX: tabBarMoveAmount as unknown as number }] };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Animated.View
          style={StyleSheet.flatten([styles.scrollableContainer, tabBarMoveAmountStyle])} {...panResponder.panHandlers}>
          {tabItems}
        </Animated.View>
      </ScrollView>
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
    paddingRight: Dimensions.get('window').width,
    left: 0,
  },
  item: {
    marginRight: 20,
  },
});
