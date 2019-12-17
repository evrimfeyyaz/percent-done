import React, { useEffect, useState } from 'react';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import {
  Animated,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  LayoutAnimation,
  TouchableWithoutFeedback,
  ListRenderItemInfo,
  View,
  Text,
} from 'react-native';

interface SwipeableListHiddenAction<T> {
  title?: string;
  icon?: any;
  color: string;
  main?: boolean;
  hideRowOnInteraction?: boolean | ((key: string) => boolean);
  onInteraction?: (key: string, rowMap: RowMap<T>) => void;
}

interface SwipeableListProps<T> {
  data?: T[];
  hiddenActionsLeft?: SwipeableListHiddenAction<T>[];
  hiddenActionsRight?: SwipeableListHiddenAction<T>[];
  leftOpenValue?: number;
  rightOpenValue?: number;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  autoSelectRightOuterAction?: boolean;
  autoSelectLeftOuterAction?: boolean;

  renderItem(rowData: ListRenderItemInfo<T>, rowMap: RowMap<T>): JSX.Element | null;

  keyExtractor?(item: T, index?: number): string;
}

export const SwipeableList = <T, >({
                                     data,
                                     renderItem,
                                     hiddenActionsLeft,
                                     hiddenActionsRight,
                                     autoSelectLeftOuterAction,
                                     autoSelectRightOuterAction,
                                     leftOpenValue: propsLeftOpenValue,
                                     rightOpenValue: propsRightOpenValue,
                                     keyExtractor: propsKeyExtractor,
                                     disableLeftSwipe: propsDisableLeftSwipe,
                                     disableRightSwipe: propsDisableRightSwipe,
                                   }: SwipeableListProps<T>) => {
  // LayoutAnimation.easeInEaseOut();
  const disableLeftSwipe = propsDisableLeftSwipe === true || hiddenActionsRight == null || hiddenActionsRight.length === 0;
  const disableRightSwipe = propsDisableRightSwipe === true || hiddenActionsLeft == null || hiddenActionsLeft.length === 0;

  const keyExtractor = propsKeyExtractor ?? ((item: any, index: number): string => {
    if (typeof (item) === 'object' && item !== null && item.hasOwnProperty('key')) {
      return item.key ?? index.toString();
    }

    return index.toString();
  });

  let isSwipeAnimationRunning = false;

  /**
   * The width of the swipeable list.
   */
  const [listWidth, setListWidth] = useState(0);

  /**
   * Current direction that a given list item is being swiped in.
   */
  const [itemSwipeDirections, setItemSwipeDirections] = useState<{ [key: string]: 'left' | 'right' }>({});

  /**
   * Current amount that a given list item is swiped in any given horizontal direction, i.e. how much
   * the user has moved the list item (row) in a swipe.
   */
  const [itemSwipeValues, setItemSwipeValues] = useState<{ [key: string]: Animated.Value }>({});

  /**
   * Current visibility value of a given list item. Used when hiding a list item when it is
   * being removed after a swipe or tap that hides it.
   */
  const [itemVisibilityValues, setItemVisibilityValues] = useState<{ [key: string]: Animated.Value }>({});

  /**
   * When auto select outer action is true, the outer action has position absolute when the user swipes it
   * far enough to auto select this action. This state variable keeps the position property based on the
   * swipe value.
   */
  const [itemOuterActionPositionStyles, setItemOuterActionPositionStyles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const swipeDirections: typeof itemSwipeDirections = {};
    const swipeValues: typeof itemSwipeValues = {};
    const visibilityValues: typeof itemVisibilityValues = {};
    const outerActionPositionStyles: typeof itemOuterActionPositionStyles = {};

    data?.forEach((item, index) => {
      const key = keyExtractor(item, index);

      swipeDirections[key] = 'left';
      swipeValues[key] = new Animated.Value(0);
      visibilityValues[key] = new Animated.Value(1);
      outerActionPositionStyles[key] = 'relative';

      swipeValues[key].addListener((animatedValue => {
        const swipeValue = animatedValue.value;
        const rOpenValue = rightOpenValue ?? 0;
        const lOpenValue = leftOpenValue ?? 0;

        if (itemSwipeDirections[key] === 'left' && autoSelectRightOuterAction && swipeValue >= rOpenValue) {
          outerActionPositionStyles[key] = 'absolute';
        } else if (itemSwipeDirections[key] === 'right' && autoSelectLeftOuterAction && swipeValue >= lOpenValue) {
          outerActionPositionStyles[key] = 'absolute';
        } else {
          outerActionPositionStyles[key] = 'relative';
        }
      }));
    });

    setItemSwipeDirections(swipeDirections);
    setItemSwipeValues(swipeValues);
    setItemVisibilityValues(visibilityValues);
    setItemOuterActionPositionStyles(outerActionPositionStyles);

    return () => {
      for (let key in itemSwipeValues) {
        itemSwipeValues[key].removeAllListeners();
      }
    };
  }, [data]);

  const handleSwipeListViewLayout = (event: LayoutChangeEvent) => {
    setListWidth(event.nativeEvent.layout.width);
  };

  const handleSwipeValueChange = (data: {
    key: string;
    value: number;
    direction: 'left' | 'right';
    isOpen: boolean;
  }) => {
    const { key, value } = data;

    if (value > 0 && itemSwipeDirections[key] === 'left') {
      setItemSwipeDirections({ ...itemSwipeDirections, [key]: 'right' });
    } else if (value < 0 && itemSwipeDirections[key] === 'right') {
      setItemSwipeDirections({ ...itemSwipeDirections, [key]: 'left' });
    }

    itemSwipeValues[key].setValue(Math.abs(value));

    // if (value >= listWidth && !isSwipeAnimationRunning && itemSwipeDirections[key] === 'right') {
    //   const goal = goals.find(goal => goal.id === key);
    //   if (goal != null && isGoalTracked(goal)) return;
    //
    //   isSwipeAnimationRunning = true;
    //
    //   Animated.timing(itemVisibilityValues[key], { toValue: 0, duration: 300 }).start(() => {
    //     onGoalRightSwipe?.(key);
    //     isSwipeAnimationRunning = false;
    //   });
    // }
  };

  const makeHiddenActionElement = (hiddenAction: SwipeableListHiddenAction<T>, rowKey: string, outerAction = false) => {
    const { color, title } = hiddenAction;

    let style: any[];

    if (outerAction) {
      const swipeValueToAutoSelect = (itemSwipeDirections[rowKey] === 'left' ? rightOpenValue : leftOpenValue) ?? 0;

      style = [styles.hiddenAction, {
        backgroundColor: color,
        flex: itemSwipeValues[rowKey]?.interpolate({
          inputRange: [0, swipeValueToAutoSelect, swipeValueToAutoSelect],
          outputRange: [1, 1, 0],
          extrapolate: 'clamp',
        }),
        position: itemOuterActionPositionStyles[rowKey],
        right: 0,
        width: '100%',
      }];
    } else {
      style = [styles.hiddenAction, {
        backgroundColor: color,
        flex: 1,
      }];
    }

    // TODO: Center the text based on width.
    return (
      <Animated.View style={style}>
        <Text numberOfLines={1} ellipsizeMode='clip'>{title}</Text>
      </Animated.View>
    );
  };

  /**
   * When the user swipes past the value to open a row, if auto select outer action is selected,
   * then the outer action's position is set to absolute, and this element fills its place to make
   * sure that all other actions are not misaligned when the outer action leaves the flexbox container.
   */
  const makeFillerActionElement = (rowKey: string) => {
    const swipeValueToFill = (itemSwipeDirections[rowKey] === 'left' ? rightOpenValue : leftOpenValue) ?? 0;

    const style = [styles.fillerAction, {
      flex: itemSwipeValues[rowKey]?.interpolate({
        inputRange: [0, swipeValueToFill, swipeValueToFill],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
      }),
    }];

    return (
      <Animated.View style={style} />
    );
  };

  const renderHiddenItem = (rowData: ListRenderItemInfo<T>, rowMap: RowMap<T>): JSX.Element => {
    const key = keyExtractor(rowData.item);
    const swipeDirection = itemSwipeDirections[key];
    const swipeValue = itemSwipeValues[key];
    const hiddenActions = swipeDirection === 'left' ? hiddenActionsRight : hiddenActionsLeft;

    const hiddenActionElements = hiddenActions?.map((item, index, array) => {
      if (swipeDirection === 'left' && index === array.length - 1) {
        return makeHiddenActionElement(item, key, true);
      }

      if (swipeDirection === 'right' && index === 0) {
        return makeHiddenActionElement(item, key, true);
      }

      return makeHiddenActionElement(item, key);
    });

    const style = [styles.hiddenItem, {
      right: swipeDirection === 'left' ? 0 : undefined,
      width: swipeValue,
    }];

    if (autoSelectRightOuterAction) {
      hiddenActionElements?.push(makeFillerActionElement(key));
    }

    if (autoSelectLeftOuterAction) {
      hiddenActionElements?.unshift(makeFillerActionElement(key));
    }

    return (
      <Animated.View style={style}>
        {hiddenActionElements}
      </Animated.View>
    );
  };

  // TODO: Calculate default values when no value provided in props.
  const leftOpenValue = propsLeftOpenValue;
  const rightOpenValue = propsRightOpenValue;

  return (
    <SwipeListView
      data={data}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      keyExtractor={keyExtractor}
      onSwipeValueChange={handleSwipeValueChange}
      onLayout={handleSwipeListViewLayout}
      style={styles.swipeListView}
      disableLeftSwipe={disableLeftSwipe}
      disableRightSwipe={disableRightSwipe}
      leftOpenValue={leftOpenValue}
      rightOpenValue={-rightOpenValue}
      swipeToOpenPercent={50}
      friction={10}
    />
  );
};

const styles = StyleSheet.create({
  swipeListView: {
    alignSelf: 'stretch',
    position: 'relative',
  },
  hiddenItem: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    position: 'absolute',
  },
  hiddenAction: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillerAction: {
    height: '100%',
    zIndex: -1,
  },
});
