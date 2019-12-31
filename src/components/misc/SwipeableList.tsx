import React, { useReducer, useRef } from 'react';
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
  ViewToken,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

type ValueOrFunction<T> = T | ((rowKey: string) => T)

export interface SwipeableListHiddenAction<T> {
  title?: ValueOrFunction<string>;
  icon?: ValueOrFunction<any>;
  color: ValueOrFunction<string>;
  titleStyle?: ValueOrFunction<TextStyle>;
  hideRowOnInteraction?: ValueOrFunction<boolean>;
  onInteraction?: (rowKey: string, rowMap: RowMap<T>) => void;
}

interface SwipeableListProps<T> {
  data?: T[];
  hiddenActionsLeft?: SwipeableListHiddenAction<T>[];
  hiddenActionsRight?: SwipeableListHiddenAction<T>[];
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

  const counter = useRef(0);

  const disableLeftSwipe = propsDisableLeftSwipe === true || hiddenActionsRight == null || hiddenActionsRight.length === 0;
  const disableRightSwipe = propsDisableRightSwipe === true || hiddenActionsLeft == null || hiddenActionsLeft.length === 0;
  const leftOpenValue = (hiddenActionsLeft?.length ?? 0) * actionWidth;
  const rightOpenValue = (hiddenActionsRight?.length ?? 0) * -actionWidth;

  // TODO: Try: 1-Only using text. 2-Conditional hidden item rendering.

  const onViewableItemsChanged = useRef((info: { viewableItems: Array<ViewToken>, changed: Array<ViewToken> }) => {
    // console.log('Changed:' + info.changed.map(item => ` ${item.item.title}: ${item.isViewable}`));
    // console.log('Viewable:' + info.viewableItems.map(item => ` ${item.item.title}: ${item.isViewable}`));

    info.changed.forEach(({ isViewable, key }) => {
      if (isViewable) {
        rowSwipeValues.current.set(key, new Animated.Value(0));
        rowOuterActionWidthPercents.current.set(key, new Animated.Value(0));
        rowOpacities.current.set(key, new Animated.Value(1));
        isRowClosing.current.set(key, false);

        hasSwipedPastAutoSelect.current.set(key, new Proxy({ value: false }, {
          set: (obj, objKey, newValue) => {
            if (objKey !== 'value') return false;

            if (!obj.value && newValue === true) {
              obj.value = newValue;
              runAutoSelectOuterActionAnimation(key);

              return true;
            } else if (obj.value && newValue === false) {
              obj.value = newValue;
              runAutoDeselectOuterActionAnimation(key);

              return true;
            }

            return false;
          },
        }));

        rowSwipeDirections.current.set(key, new Proxy({ value: undefined }, {
          set: (obj, objKey, newValue) => {
            if (objKey !== 'value') return false;

            if (obj.value !== newValue) {
              obj.value = newValue;
              const widthPercent = outerActionWidthPercentWhenNotAutoSelected(key);
              rowOuterActionWidthPercents.current.get(key)?.setValue(widthPercent);
              forceUpdate(undefined);

              return true;
            }

            return false;
          },
        }));
      } else {
        rowSwipeValues.current.delete(key);
        rowOuterActionWidthPercents.current.delete(key);
        rowOpacities.current.delete(key);
        isRowClosing.current.delete(key);
        rowHeights.current.delete(key);
        hasSwipedPastAutoSelect.current.delete(key);
        rowSwipeDirections.current.delete(key);
      }
    });
  });
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 0, minimumViewTime: 500 });

  /**
   * Current amount that a given row is swiped in any given horizontal direction, i.e. how much
   * the user has moved the row in a swipe.
   */
  const rowSwipeValues = useRef<Map<string, Animated.Value>>(new Map());

  /**
   * Similar to `rowOuterActionsPositionStyles`. Defines widths in percents for the animation that makes the
   * outer action take up the whole space when it is "auto selected."
   */
  const rowOuterActionWidthPercents = useRef<Map<string, Animated.Value>>(new Map());

  /**
   * Row opacities to slowly fade a row when it is being hidden.
   */
  const rowOpacities = useRef<Map<string, Animated.Value>>(new Map());

  /**
   * Whether a row with given key is currently in the process of closing.
   */
  const isRowClosing = useRef<Map<string, boolean>>(new Map());

  /**
   * Row heights to slowly shrink a row when it is being hidden.
   */
  const rowHeights = useRef<Map<string, Animated.Value>>(new Map());

  /**
   * Whether the user has swiped more than the amount required to auto select the outer action.
   */
  const hasSwipedPastAutoSelect = useRef<Map<string, { value: boolean }>>(new Map());

  /**
   * Current direction that a given row is being swiped in.
   */
  const rowSwipeDirections = useRef<Map<string, { value: 'left' | 'right' | undefined }>>(new Map());

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  function handleSwipeValueChange(data: {
    key: string;
    value: number;
    direction: 'left' | 'right';
    isOpen: boolean;
  }) {
    const { key, value } = data;
    rowSwipeValues.current.get(key)?.setValue(value);
    setSwipeDirectionState(key, value);
    setHasSwipedPastAutoSelectState(key, value);
  }

  function handleRowOpen(rowKey: string, rowMap: RowMap<T>) {
    if (!hasSwipedPastAutoSelect.current.get(rowKey)?.value) return;

    const swipeDirection = rowSwipeDirections.current.get(rowKey)?.value;
    const hiddenActions = visibleHiddenActions(rowKey);

    let outerAction: SwipeableListHiddenAction<T> | undefined;
    if (swipeDirection === 'right') {
      outerAction = hiddenActions && hiddenActions[0];
    } else if (swipeDirection === 'left') {
      outerAction = hiddenActions && hiddenActions[hiddenActions.length - 1];
    }

    if (outerAction == null) return;

    if ((swipeDirection === 'right' && autoSelectLeftOuterAction) ||
      (swipeDirection === 'left' && autoSelectRightOuterAction)) {
      handleHiddenActionInteraction(rowKey, rowMap, outerAction);
    }
  }

  function handleRowDidClose(rowKey: string) {
    isRowClosing.current.set(rowKey, false);
  }

  function handleItemLayout(event: LayoutChangeEvent, rowKey: string) {
    counter.current++;
    console.log(`${counter.current} rendering ${rowKey}`);

    const { height } = event.nativeEvent.layout;

    rowHeights.current.set(rowKey, new Animated.Value(height));
  }

  function handleHiddenActionInteraction(rowKey: string, rowMap: RowMap<T>, hiddenAction: SwipeableListHiddenAction<T>) {
    hiddenAction.onInteraction?.(rowKey, rowMap);
    isRowClosing.current.set(rowKey, true);
    rowMap[rowKey].closeRow();

    const shouldHideRow = getHiddenActionPropertyValue(rowKey, hiddenAction.hideRowOnInteraction);

    if (shouldHideRow) {
      Animated.parallel([
        Animated.timing(
          rowOpacities.current.get(rowKey),
          {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          },
        ),
        Animated.timing(
          rowHeights[rowKey],
          {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          },
        ),
      ]).start();
    }
  }

  function keyExtractor(item: any, index: number): string {
    if (propsKeyExtractor) return propsKeyExtractor(item, index);

    if (typeof (item) === 'object' && item !== null && item.hasOwnProperty('key')) {
      return item.key ?? index.toString();
    }

    return index.toString();
  }

  /**
   * As hidden action properties can be functions that return different values for a given
   * row key, this function checks if a property is a function, and runs it if so. Otherwise
   * it only returns the value.
   */
  function getHiddenActionPropertyValue<PropertyT>(rowKey: string, property: ValueOrFunction<PropertyT>): PropertyT {
    if (property instanceof Function) {
      return property(rowKey);
    }

    return property;
  }

  function runAutoSelectOuterActionAnimation(rowKey: string) {
    Animated.timing(
      rowOuterActionWidthPercents.current.get(rowKey),
      {
        toValue: 100,
        duration: 200,
      },
    ).start();
  }

  function runAutoDeselectOuterActionAnimation(rowKey: string) {
    Animated.timing(
      rowOuterActionWidthPercents.current.get(rowKey),
      {
        toValue: outerActionWidthPercentWhenNotAutoSelected(rowKey),
        duration: 200,
      },
    ).start();
  }

  function swipeDirectionFromSwipeValue(swipeValue: number) {
    if (swipeValue === 0) return undefined;

    return swipeValue > 0 ? 'right' : 'left';
  }

  function outerActionWidthPercentWhenNotAutoSelected(rowKey: string) {
    const hiddenActions = visibleHiddenActions(rowKey);

    if (hiddenActions == null || hiddenActions.length === 0) return 0;

    return 100 / hiddenActions.length;
  }

  function setHasSwipedPastAutoSelectState(rowKey: string, value: number) {
    const swipeDirection = swipeDirectionFromSwipeValue(value);

    const swipedPastAutoSelectForLeftAction = swipeDirection === 'right' && value >= leftOpenValue * AUTO_SELECT_CUTOFF && !hasSwipedPastAutoSelect.current.get(rowKey)?.value && !isRowClosing.current.get(rowKey);
    const swipedBehindAutoSelectForLeftAction = swipeDirection === 'right' && value < leftOpenValue * AUTO_SELECT_CUTOFF && hasSwipedPastAutoSelect.current.get(rowKey)?.value;
    const swipedPastAutoSelectForRightAction = swipeDirection === 'left' && value <= rightOpenValue * AUTO_SELECT_CUTOFF && !hasSwipedPastAutoSelect.current.get(rowKey)?.value && !isRowClosing.current.get(rowKey);
    const swipedBehindAutoSelectForRightAction = swipeDirection === 'left' && value > rightOpenValue * AUTO_SELECT_CUTOFF && hasSwipedPastAutoSelect.current.get(rowKey)?.value;

    if (!isRowClosing.current.get(rowKey)) {
      if ((autoSelectLeftOuterAction && (swipedPastAutoSelectForLeftAction || swipedBehindAutoSelectForLeftAction))) {
        ReactNativeHapticFeedback.trigger('impactLight');
      } else if ((autoSelectRightOuterAction && (swipedPastAutoSelectForRightAction || swipedBehindAutoSelectForRightAction))) {
        ReactNativeHapticFeedback.trigger('impactLight');
      }
    }

    const swipedPastAutoSelectProxy = hasSwipedPastAutoSelect.current.get(rowKey);

    if (swipedPastAutoSelectProxy == null) return;

    if (swipedPastAutoSelectForLeftAction) {
      swipedPastAutoSelectProxy.value = true;
    } else if (swipedBehindAutoSelectForLeftAction) {
      swipedPastAutoSelectProxy.value = false;
    } else if (swipedPastAutoSelectForRightAction) {
      swipedPastAutoSelectProxy.value = true;
    } else if (swipedBehindAutoSelectForRightAction) {
      swipedPastAutoSelectProxy.value = false;
    } else if (swipeDirection === null) {
      swipedPastAutoSelectProxy.value = false;
    }
  }

  function setSwipeDirectionState(rowKey: string, swipeValue: number) {
    const swipeDirectionProxy = rowSwipeDirections.current.get(rowKey);

    if (swipeDirectionProxy == null) return;

    const swipeDirection = swipeDirectionFromSwipeValue(swipeValue);

    if (swipeDirectionProxy.value !== swipeDirection) {
      swipeDirectionProxy.value = swipeDirectionFromSwipeValue(swipeValue);
    }
  }

  function makeHiddenActionElement(hiddenAction: SwipeableListHiddenAction<T>, rowKey: string, rowMap: RowMap<T>, outerAction = false) {
    const swipeDirection = rowSwipeDirections.current.get(rowKey)?.value;

    const rowSpecificTitleStyle = getHiddenActionPropertyValue(rowKey, hiddenAction.titleStyle);
    const icon = getHiddenActionPropertyValue(rowKey, hiddenAction.icon);
    const title = getHiddenActionPropertyValue(rowKey, hiddenAction.title);
    const color = getHiddenActionPropertyValue(rowKey, hiddenAction.color);

    let style: any[];

    const commonStyle = {
      backgroundColor: color,
      alignItems: swipeDirection === 'left' ? 'flex-start' : 'flex-end',
    };

    if (outerAction) {
      style = [styles.hiddenAction, commonStyle, {
        zIndex: 9999,
        position: 'absolute',
        right: swipeDirection === 'left' ? 0 : undefined,
        left: swipeDirection === 'right' ? 0 : undefined,
        width: rowOuterActionWidthPercents.current.get(rowKey).interpolate({
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
      <TouchableWithoutFeedback onPress={() => handleHiddenActionInteraction(rowKey, rowMap, hiddenAction)}>
        <Animated.View style={style}>
          <View style={contentStyle}>
            {icon && (<Image source={icon} />)}
            {title && (<Text style={[titleStyle, rowSpecificTitleStyle]}>{title}</Text>)}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  function visibleHiddenActions(rowKey: string) {
    const swipeDirection = rowSwipeDirections.current.get(rowKey)?.value;

    let actions: typeof hiddenActionsLeft;
    if (swipeDirection === 'right') {
      actions = hiddenActionsLeft;
    } else if (swipeDirection === 'left') {
      actions = hiddenActionsRight;
    }

    return actions;
  }

  function renderHiddenItem(rowData: (ListRenderItemInfo<T> | SectionListRenderItemInfo<T>), rowMap: RowMap<T>): JSX.Element {
    const key = keyExtractor(rowData.item, rowData.index);

    const swipeDirection = rowSwipeDirections.current.get(key)?.value;
    const swipeValue = rowSwipeValues.current.get(key);
    const hiddenActions = visibleHiddenActions(key);

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
      opacity: rowOpacities.current.get(key),
      height: rowHeights.current.get(key),
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

  function renderItem(rowData: (ListRenderItemInfo<T> | SectionListRenderItemInfo<T>)): React.ReactElement | null {
    const { item, index } = rowData;
    const rowKey = keyExtractor(item, index);

    const itemStyle = {
      opacity: rowOpacities.current.get(rowKey),
      height: rowHeights.current.get(rowKey),
    };

    return (
      <Animated.View style={itemStyle}>
        <View onLayout={(event) => handleItemLayout(event, rowKey)} style={{ flex: 1 }}>
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
      onRowDidClose={handleRowDidClose}
      viewabilityConfig={viewabilityConfig.current}
      onViewableItemsChanged={onViewableItemsChanged.current}
      // windowSize={2}
      directionalDistanceChangeThreshold={0}
      useNativeDriver={true}
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
    flexDirection: 'row',
    position: 'absolute',
  },
  hiddenAction: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
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

