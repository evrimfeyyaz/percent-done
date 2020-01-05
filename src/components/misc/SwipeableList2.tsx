import React, { useRef } from 'react';
import { FlatList, FlatListProps, ListRenderItemInfo, TextStyle } from 'react-native';
import { SwipeableItem, SwipeableItemAction } from './SwipeableItem';

type Actions = SwipeableItemAction[] | ((rowKey: string) => SwipeableItemAction[]);

interface SwipeableList2Props {
  leftActions?: Actions;
  rightActions?: Actions;
  titleStyle?: TextStyle;
}

export const SwipeableList2 = <T, >({
                                      leftActions,
                                      rightActions,
                                      data,
                                      titleStyle,
                                      renderItem: propsRenderItem,
                                      keyExtractor: propsKeyExtractor,
                                    }: SwipeableList2Props & FlatListProps<T>) => {
  const listRef = useRef<FlatList<T>>(null);

  function handleSwipeBegin() {
    // @ts-ignore
    listRef.current?.setNativeProps({ scrollEnabled: false });
  }

  function handleSwipeEnd() {
    // @ts-ignore
    listRef.current?.setNativeProps({ scrollEnabled: true });
  }

  function keyExtractor(item: any, index: number): string {
    if (propsKeyExtractor) return propsKeyExtractor(item, index);

    if (typeof (item) === 'object' && item !== null && item.hasOwnProperty('key')) {
      return item.key ?? index.toString();
    }

    return index.toString();
  }

  function getActionsForItem(key: string, actions: Actions) {
    if (Array.isArray(actions)) {
      return actions;
    }

    return actions(key);
  }

  function renderItem(info: ListRenderItemInfo<T>): React.ReactElement | null {
    const { item, index } = info;
    const key = keyExtractor(item, index);

    const itemLeftActions = leftActions && getActionsForItem(key, leftActions);
    const itemRightActions = rightActions && getActionsForItem(key, rightActions);

    return (
      <SwipeableItem
        leftActions={itemLeftActions}
        rightActions={itemRightActions}
        autoSelectRightOuterAction
        onSwipeBegin={handleSwipeBegin}
        onSwipeEnd={handleSwipeEnd}
        titleStyle={titleStyle}
      >
        {propsRenderItem(info)}
      </SwipeableItem>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      ref={listRef}
    />
  );
};
