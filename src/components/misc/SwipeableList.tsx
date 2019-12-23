import React, { useEffect, useRef, useState } from 'react';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import {
  Animated,
  Image, LayoutChangeEvent,
  ListRenderItem,
  ListRenderItemInfo,
  SectionListRenderItem,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export interface SwipeableListHiddenAction<T> {
  title?: string;
  icon?: any;
  color: string;
  titleStyle?: TextStyle;
  hideRowOnInteraction?: boolean | ((rowKey: string) => boolean);
  onInteraction?: (rowKey: string, rowMap: RowMap<T>) => void;
}

type SwipeableListHiddenActions<T> =
  SwipeableListHiddenAction<T>[]
  | ((rowKey: string) => SwipeableListHiddenAction<T>[]);

interface SwipeableListProps<T> {
  data?: T[];
  hiddenActionsLeft?: SwipeableListHiddenActions<T>;
  hiddenActionsRight?: SwipeableListHiddenActions<T>;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  autoSelectRightOuterAction?: boolean;
  autoSelectLeftOuterAction?: boolean;
  actionWidth: number;
  closeOnRowOpen?: boolean;
  closeOnRowBeginSwipe?: boolean;
  closeOnRowPress?: boolean;
  titleStyle?: TextStyle;
  renderItem: ListRenderItem<T> | SectionListRenderItem<T>;

  keyExtractor?(item: T, index?: number): string;
}

export const SwipeableList = <T, >({
                                     data,
                                     renderItem: propsRenderItem,
                                     hiddenActionsLeft,
                                     hiddenActionsRight,
                                     autoSelectLeftOuterAction,
                                     autoSelectRightOuterAction,
                                     actionWidth,
                                     keyExtractor: propsKeyExtractor,
                                     disableLeftSwipe: propsDisableLeftSwipe,
                                     disableRightSwipe: propsDisableRightSwipe,
                                     closeOnRowBeginSwipe,
                                     closeOnRowOpen,
                                     closeOnRowPress,
                                     titleStyle,
                                   }: SwipeableListProps<T>) => {
  /**
   * When the user swipes past this amount multiplied by open value (the width of the hidden item
   * when it is open), the outer action is auto selected if auto select is set to `true`.
   */
  const AUTO_SELECT_CUTOFF = 1.2;

  const disableLeftSwipe = propsDisableLeftSwipe === true || hiddenActionsRight == null || hiddenActionsRight.length === 0;
  const disableRightSwipe = propsDisableRightSwipe === true || hiddenActionsLeft == null || hiddenActionsLeft.length === 0;
  const leftOpenValue = (hiddenActionsLeft?.length ?? 0) * actionWidth;
  const rightOpenValue = (hiddenActionsRight?.length ?? 0) * -actionWidth;

  const isAutoSelectAnimationRunning = useRef(false);

  /**
   * Current amount that a given list item is swiped in any given horizontal direction, i.e. how much
   * the user has moved the list item (row) in a swipe.
   */
  const itemSwipeValues = useRef<{ [key: string]: Animated.Value }>({});

  /**
   * Current visibility value of a given list item. Used when hiding a list item when it is
   * being removed after a swipe or tap that hides it.
   */
  const itemVisibilityValues = useRef<{ [key: string]: Animated.Value }>({});

  /**
   * Similar to `itemOuterActionsPositionStyles`. Defines widths in percents for the animation that makes the
   * outer action take up the whole space when it is "auto selected."
   */
  const itemOuterActionWidthPercents = useRef<{ [key: string]: Animated.Value }>({});

  /**
   * Item opacities to slowly fade item when it is being hidden.
   */
  const itemOpacities = useRef<{ [key: string]: Animated.Value }>({});

  /**
   * Item vertical scales to slowly shrink item when it is being hidden.
   */
  const itemHeights = useRef<{ [key: string]: Animated.Value }>({});

  /**
   * Whether the user has swiped more than the amount required to auto select the outer action.
   */
  const [hasSwipedPastAutoSelect, setHasSwipedPastAutoSelect] = useState<{ [key: string]: boolean }>({});

  /**
   * Current direction that a given list item is being swiped in.
   */
  const [itemSwipeDirections, setItemSwipeDirections] = useState<{ [key: string]: 'left' | 'right' }>({});

  useEffect(() => {
    const swipeDirections: typeof itemSwipeDirections = {};
    const swipedPastAutoSelect: typeof hasSwipedPastAutoSelect = {};

    itemSwipeValues.current = {};
    itemVisibilityValues.current = {};
    itemOuterActionWidthPercents.current = {};
    itemOpacities.current = {};
    itemHeights.current = {};

    data?.forEach((item, index) => {
      const key = keyExtractor(item, index);

      swipeDirections[key] = 'left';
      swipedPastAutoSelect[key] = false;
      itemSwipeValues.current[key] = new Animated.Value(0);
      itemVisibilityValues.current[key] = new Animated.Value(1);
      itemOuterActionWidthPercents.current[key] = new Animated.Value(0);
      itemOpacities.current[key] = new Animated.Value(1);
    });

    setItemSwipeDirections(swipeDirections);
    setHasSwipedPastAutoSelect(swipedPastAutoSelect);
  }, [data]);

  function handleSwipeValueChange(data: {
    key: string;
    value: number;
    direction: 'left' | 'right';
    isOpen: boolean;
  }) {
    const { key, value } = data;

    itemSwipeValues.current[key].setValue(value);
    setSwipeDirectionState(key, value);
    setHasSwipedPastAutoSelectState(key, value);
    runAutoSelectOuterActionAnimation(key, value);
  }

  function handleRowOpen(rowKey: string, rowMap: RowMap<T>) {
    if (!hasSwipedPastAutoSelect[rowKey]) return;

    const swipeDirection = itemSwipeDirections[rowKey];
    const hiddenActions = visibleHiddenActions(rowKey);

    let outerAction: SwipeableListHiddenAction<T> | undefined;
    if (swipeDirection === 'right') {
      outerAction = hiddenActions && hiddenActions[0];
    } else {
      outerAction = hiddenActions && hiddenActions[hiddenActions.length - 1];
    }

    if (outerAction == null) return;

    if ((swipeDirection === 'right' && autoSelectLeftOuterAction) ||
      (swipeDirection === 'left' && autoSelectRightOuterAction)) {
      handleHiddenActionInteraction(outerAction, rowKey, rowMap);
    }
  }

  function keyExtractor(item: any, index: number): string {
    if (propsKeyExtractor) return propsKeyExtractor(item, index);

    if (typeof (item) === 'object' && item !== null && item.hasOwnProperty('key')) {
      return item.key ?? index.toString();
    }

    return index.toString();
  }

  function runAutoSelectOuterActionAnimation(rowKey: string, swipeValue: number) {
    const swipeDirection = swipeDirectionFromSwipeValue(swipeValue);

    if (swipeDirection === 'left' && !autoSelectRightOuterAction) return;
    if (swipeDirection === 'right' && !autoSelectLeftOuterAction) return;

    if (!isAutoSelectAnimationRunning.current) {
      isAutoSelectAnimationRunning.current = true;

      if (hasSwipedPastAutoSelect[rowKey]) {
        Animated.timing(
          itemOuterActionWidthPercents.current[rowKey],
          {
            toValue: 100,
            duration: 200,
          },
        ).start(() => {
          isAutoSelectAnimationRunning.current = false;
        });
      } else {
        Animated.timing(
          itemOuterActionWidthPercents.current[rowKey],
          {
            toValue: outerActionWidthPercentWhenNotAutoSelected(rowKey),
            duration: 200,
          },
        ).start(() => {
          isAutoSelectAnimationRunning.current = false;
        });
      }
    }
  }

  function swipeDirectionFromSwipeValue(swipeValue: number) {
    return swipeValue > 0 ? 'right' : 'left';
  }

  function outerActionWidthPercentWhenNotAutoSelected(rowKey: string) {
    const hiddenActions = visibleHiddenActions(rowKey);

    return 100 / (hiddenActions?.length ?? 1);
  }

  function setHasSwipedPastAutoSelectState(rowKey: string, value: number) {
    const swipeDirection = swipeDirectionFromSwipeValue(value);

    if (swipeDirection === 'right' && value >= leftOpenValue * AUTO_SELECT_CUTOFF && !hasSwipedPastAutoSelect[rowKey]) {
      setHasSwipedPastAutoSelect({ ...hasSwipedPastAutoSelect, [rowKey]: true });
    } else if (swipeDirection === 'right' && value < leftOpenValue * AUTO_SELECT_CUTOFF && hasSwipedPastAutoSelect[rowKey]) {
      setHasSwipedPastAutoSelect({ ...hasSwipedPastAutoSelect, [rowKey]: false });
    } else if (swipeDirection === 'left' && value <= rightOpenValue * AUTO_SELECT_CUTOFF && !hasSwipedPastAutoSelect[rowKey]) {
      setHasSwipedPastAutoSelect({ ...hasSwipedPastAutoSelect, [rowKey]: true });
    } else if (swipeDirection === 'left' && value > rightOpenValue * AUTO_SELECT_CUTOFF && hasSwipedPastAutoSelect[rowKey]) {
      setHasSwipedPastAutoSelect({ ...hasSwipedPastAutoSelect, [rowKey]: false });
    }
  }

  function setSwipeDirectionState(rowKey: string, swipeValue: number) {
    const swipeDirection = swipeDirectionFromSwipeValue(swipeValue);

    if (swipeDirection === 'right' && itemSwipeDirections[rowKey] === 'left') {
      setItemSwipeDirections({ ...itemSwipeDirections, [rowKey]: 'right' });
    } else if (swipeDirection === 'left' && itemSwipeDirections[rowKey] === 'right') {
      setItemSwipeDirections({ ...itemSwipeDirections, [rowKey]: 'left' });
    }
  }

  function handleHiddenActionInteraction(hiddenAction: SwipeableListHiddenAction<T>, rowKey: string, rowMap: RowMap<T>) {
    hiddenAction.onInteraction?.(rowKey, rowMap);
    rowMap[rowKey].closeRow();

    const { hideRowOnInteraction } = hiddenAction;
    let shouldHideRow = false;
    if (typeof hideRowOnInteraction === 'boolean') {
      shouldHideRow = hideRowOnInteraction;
    } else if (typeof hideRowOnInteraction === 'function') {
      shouldHideRow = hideRowOnInteraction(rowKey);
    }

    if (shouldHideRow) {
      Animated.parallel([
        Animated.timing(
          itemOpacities.current[rowKey],
          {
            toValue: 0,
            duration: 200,
          },
        ),
        Animated.timing(
          itemHeights.current[rowKey],
          {
            toValue: 0,
            duration: 200,
          },
        ),
      ]).start();
    }
  }

  function handleItemLayout(event: LayoutChangeEvent, rowKey: string) {
    const { height } = event.nativeEvent.layout;

    itemHeights.current[rowKey] = new Animated.Value(height);
  }

  function makeHiddenActionElement(hiddenAction: SwipeableListHiddenAction<T>, rowKey: string, rowMap: RowMap<T>, outerAction = false) {
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
        width: itemOuterActionWidthPercents.current[rowKey].interpolate({
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

    const contentStyle = [styles.hiddenActionContentStyle, {
      width: actionWidth,
    }];

    return (
      <TouchableWithoutFeedback onPress={() => handleHiddenActionInteraction(hiddenAction, rowKey, rowMap)}>
        <Animated.View style={style}>
          <View style={contentStyle}>
            {hiddenAction.icon && (
              <Image source={hiddenAction.icon} />
            )}
            {hiddenAction.title && (
              <Text style={[titleStyle, hiddenAction.titleStyle]}>{title}</Text>
            )}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  function visibleHiddenActions(rowKey: string) {
    const swipeDirection = itemSwipeDirections[rowKey];

    let actions: typeof hiddenActionsLeft;
    if (swipeDirection === 'right') {
      actions = (Array.isArray(hiddenActionsLeft) || hiddenActionsLeft == null) ? hiddenActionsLeft : hiddenActionsLeft?.(rowKey);
    } else {
      actions = (Array.isArray(hiddenActionsRight) || hiddenActionsRight == null) ? hiddenActionsRight : hiddenActionsRight?.(rowKey);
    }

    return actions;
  }

  function renderHiddenItem(rowData: (ListRenderItemInfo<T> | SectionListRenderItemInfo<T>), rowMap: RowMap<T>): JSX.Element {
    const key = keyExtractor(rowData.item, rowData.index);
    const swipeDirection = itemSwipeDirections[key];
    const swipeValue = itemSwipeValues.current[key];
    const hiddenActions = visibleHiddenActions(key);

    if (!isAutoSelectAnimationRunning.current) {
      const widthPercent = outerActionWidthPercentWhenNotAutoSelected(key);
      itemOuterActionWidthPercents.current[key]?.setValue(widthPercent);
    }

    const hiddenActionElements = hiddenActions?.map((item, index, array) => {
      if (swipeDirection === 'left' && index === array.length - 1) {
        return makeHiddenActionElement(item, key, rowMap, true);
      }

      if (swipeDirection === 'right' && index === 0) {
        return makeHiddenActionElement(item, key, rowMap, true);
      }

      return makeHiddenActionElement(item, key, rowMap);
    });

    const style = [styles.hiddenItem, {
      right: swipeDirection === 'left' ? 0 : undefined,
      width: swipeValue?.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [1, 0, 1],
      }),
      opacity: itemOpacities.current[key],
      height: itemHeights.current[key],
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
  }

  function renderItem(rowData: (ListRenderItemInfo<T> | SectionListRenderItemInfo<T>), rowMap?: RowMap<T>): React.ReactElement | null {
    const { item, index } = rowData;
    const rowKey = keyExtractor(item, index);

    const itemStyle = {
      opacity: itemOpacities.current[rowKey],
      height: itemHeights.current[rowKey],
    };

    return (
      <Animated.View style={itemStyle}>
        <View onLayout={event => handleItemLayout(event, rowKey)}>
          {propsRenderItem(rowData)}
        </View>
      </Animated.View>
    );
  }

  return (
    <SwipeListView
      data={data}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      keyExtractor={keyExtractor}
      onSwipeValueChange={handleSwipeValueChange}
      style={styles.swipeListView}
      closeOnRowOpen={closeOnRowOpen}
      closeOnRowBeginSwipe={closeOnRowBeginSwipe}
      closeOnRowPress={closeOnRowPress}
      disableLeftSwipe={disableLeftSwipe}
      disableRightSwipe={disableRightSwipe}
      leftOpenValue={leftOpenValue}
      rightOpenValue={rightOpenValue}
      swipeToOpenPercent={50}
      friction={10}
      onRowOpen={handleRowOpen}
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
  },
  hiddenActionContentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillerAction: {
    height: '100%',
    flex: 1,
    zIndex: -1,
  },
});
