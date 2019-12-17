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
  Text, Easing,
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
  actionContentMargin?: number | string;

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
                                     actionContentMargin = 10,
                                     leftOpenValue: propsLeftOpenValue,
                                     rightOpenValue: propsRightOpenValue,
                                     keyExtractor: propsKeyExtractor,
                                     disableLeftSwipe: propsDisableLeftSwipe,
                                     disableRightSwipe: propsDisableRightSwipe,
                                   }: SwipeableListProps<T>) => {
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
     * Similar to `itemOuterActionsPositionStyles`. Defines widths in percentage for the animation that makes the
     * outer action take up the whole space when it is "auto selected."
     */
    const [itemOuterActionWidthPercentages, setItemOuterActionWidthPercentages] = useState<{ [key: string]: Animated.Value }>({});

    useEffect(() => {
      const swipeDirections: typeof itemSwipeDirections = {};
      const swipeValues: typeof itemSwipeValues = {};
      const visibilityValues: typeof itemVisibilityValues = {};
      const outerActionWidthPercentages: typeof itemOuterActionWidthPercentages = {};

      data?.forEach((item, index) => {
        const key = keyExtractor(item, index);

        swipeDirections[key] = 'left';
        swipeValues[key] = new Animated.Value(0);
        visibilityValues[key] = new Animated.Value(1);
        outerActionWidthPercentages[key] = new Animated.Value(0);
        // outerActionWidthPercentages[key].addListener(value => console.log(value.value));
      });

      setItemSwipeDirections(swipeDirections);
      setItemSwipeValues(swipeValues);
      setItemVisibilityValues(visibilityValues);
      setItemOuterActionWidthPercentages(outerActionWidthPercentages);
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

      const rOpenValue = rightOpenValue ?? 0;
      const lOpenValue = leftOpenValue ?? 0;

      if (!isSwipeAnimationRunning) {
        isSwipeAnimationRunning = true;

        if ((itemSwipeDirections[key] === 'left' && -value >= rOpenValue) ||
          itemSwipeDirections[key] === 'right' && value >= lOpenValue) {

          Animated.timing(
            itemOuterActionWidthPercentages[key],
            {
              toValue: 100,
              duration: 200,
            },
          ).start(() => {
            isSwipeAnimationRunning = false;
          });
        } else {
          Animated.timing(
            itemOuterActionWidthPercentages[key],
            {
              toValue: getOuterActionWidthPercentageWhenNotAutoSelected(key),
              duration: 200,
            },
          ).start(() => {
            isSwipeAnimationRunning = false;
          });
        }
      }

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
      const swipeDirection = itemSwipeDirections[rowKey];

      let style: any[];

      const commonStyle = {
        backgroundColor: color,
        alignItems: swipeDirection === 'left' ? 'flex-start' : 'flex-end',
      };

      if (outerAction) {
        style = [styles.hiddenAction, commonStyle, {
          position: 'absolute',
          right: swipeDirection === 'left' ? 0 : undefined,
          left: swipeDirection === 'right' ? 0 : undefined,
          width: itemOuterActionWidthPercentages[rowKey].interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          }),
        }];
      } else {
        style = [styles.hiddenAction, commonStyle, {
          flex: 1,
        }];
      }

      const titleStyle = {
        left: swipeDirection === 'left' ? actionContentMargin : undefined,
        right: swipeDirection === 'right' ? actionContentMargin : undefined,
      };

      return (
        <Animated.View style={style}>
          <Text numberOfLines={1} ellipsizeMode='clip' style={titleStyle}>{title}</Text>
        </Animated.View>
      );
    };

    const getOuterActionWidthPercentageWhenNotAutoSelected = (key: string) => {
      const swipeDirection = itemSwipeDirections[key];
      const hiddenActions = swipeDirection === 'left' ? hiddenActionsRight : hiddenActionsLeft;

      return 100 / (hiddenActions?.length ?? 1);
    };

    const renderHiddenItem = (rowData: ListRenderItemInfo<T>): JSX.Element => {
      const key = keyExtractor(rowData.item);
      const swipeDirection = itemSwipeDirections[key];
      const swipeValue = itemSwipeValues[key];
      const hiddenActions = swipeDirection === 'left' ? hiddenActionsRight : hiddenActionsLeft;

      const widthPercentage = getOuterActionWidthPercentageWhenNotAutoSelected(key);
      itemOuterActionWidthPercentages[key]?.setValue(widthPercentage);

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

      // As the outer action is always absolutely positioned so that
      // it can have the "auto select" animation and cover up all other
      // actions, this element keeps the space filled for it, so that
      // all the other elements in the flexbox look nice.
      const filler = (<Animated.View style={styles.fillerAction} />);
      if (swipeDirection === 'left') {
        hiddenActionElements?.push(filler);
      } else {
        hiddenActionElements?.unshift(filler);
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
        rightOpenValue={rightOpenValue ? -rightOpenValue : undefined}
        swipeToOpenPercent={50}
        friction={10}
      />
    );
  }
;

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
  },
  fillerAction: {
    height: '100%',
    flex: 1,
    zIndex: -1,
  },
});
