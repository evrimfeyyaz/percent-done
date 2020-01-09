import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TextStyle,
} from 'react-native';
import { SwipeableItem, SwipeableItemAction } from './SwipeableItem';

type ValueOrFunction<T> = T | ((key: string) => T);

interface SwipeableListProps {
  actionsLeft?: ValueOrFunction<SwipeableItemAction[]>;
  actionsRight?: ValueOrFunction<SwipeableItemAction[]>;
  actionWidth?: number;
  autoSelectLeftOuterAction?: ValueOrFunction<boolean>;
  autoSelectRightOuterAction?: ValueOrFunction<boolean>;
  titleStyle?: TextStyle;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  /**
   * Called when the `scrollEnabled` attribute of the list
   * is changed. This is useful for disabling/enabling the
   * scrolling on a parent `ScrollView`.
   */
  onChangeScrollEnabled?: (scrollEnabled: boolean) => void;
}

export const SwipeableList = <T, >(props: SwipeableListProps & FlatListProps<T>) => {
  const {
    actionsLeft,
    actionsRight,
    titleStyle,
    actionWidth,
    disableLeftSwipe,
    disableRightSwipe,
    autoSelectLeftOuterAction,
    autoSelectRightOuterAction,
    onChangeScrollEnabled,
    renderItem: propsRenderItem,
    keyExtractor: propsKeyExtractor,
  } = props;

  const listRef = useRef<FlatList<T>>(null);
  const itemRefs = useRef<{ [key: string]: SwipeableItem | null }>({});

  function handleSwipeBegin(key: string) {
    closeAllItems(key);
    disableScroll();
  }

  function handleSwipeEnd() {
    enableScroll();
  }

  function handleScrollBeginDrag(evt: NativeSyntheticEvent<NativeScrollEvent>) {
    closeAllItems();
    props.onScrollBeginDrag?.(evt);
  }

  function handleSwipeItemPress() {
    closeAllItems();
  }

  function enableScroll() {
    // @ts-ignore
    listRef.current?.setNativeProps({ scrollEnabled: true });
    onChangeScrollEnabled?.(true);
  }

  function disableScroll() {
    // @ts-ignore
    listRef.current?.setNativeProps({ scrollEnabled: false });
    onChangeScrollEnabled?.(false);
  }

  function closeAllItems(skipKey?: string) {
    Object.entries(itemRefs.current).forEach(([key, item]) => {
      if (skipKey && skipKey === key) return;

      item?.close();
    });
  }

  function keyExtractor(item: any, index: number): string {
    if (propsKeyExtractor) return propsKeyExtractor(item, index);

    if (typeof (item) === 'object' && item !== null && item.hasOwnProperty('key')) {
      return item.key ?? index.toString();
    }

    return index.toString();
  }

  function getValueFromValueOrFunction<ValueT>(key: string, valueOrFunction: ValueOrFunction<ValueT>): ValueT {
    if (valueOrFunction instanceof Function) {
      return valueOrFunction(key);
    }

    return valueOrFunction;
  }

  function renderItem(info: ListRenderItemInfo<T>): React.ReactElement | null {
    const { item, index } = info;
    const key = keyExtractor(item, index);

    const itemLeftActions = getValueFromValueOrFunction(key, actionsLeft);
    const itemRightActions = getValueFromValueOrFunction(key, actionsRight);
    const itemAutoSelectLeftOuterAction = getValueFromValueOrFunction(key, autoSelectLeftOuterAction);
    const itemAutoSelectRightOuterAction = getValueFromValueOrFunction(key, autoSelectRightOuterAction);

    return (
      <SwipeableItem
        actionWidth={actionWidth}
        disableLeftSwipe={disableLeftSwipe}
        disableRightSwipe={disableRightSwipe}
        autoSelectLeftOuterAction={itemAutoSelectLeftOuterAction}
        autoSelectRightOuterAction={itemAutoSelectRightOuterAction}
        actionsLeft={itemLeftActions}
        actionsRight={itemRightActions}
        onSwipeBegin={() => handleSwipeBegin(key)}
        onSwipeEnd={handleSwipeEnd}
        titleStyle={titleStyle}
        onPress={handleSwipeItemPress}
        interactionKey={key}
        ref={ref => itemRefs.current[key] = ref}
      >
        {propsRenderItem(info)}
      </SwipeableItem>
    );
  }

  return (
    <FlatList
      {...props}
      renderItem={renderItem}
      ref={listRef}
      onScrollBeginDrag={handleScrollBeginDrag}
    />
  );
};
