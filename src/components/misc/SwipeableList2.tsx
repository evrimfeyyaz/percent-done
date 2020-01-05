import React, { useRef } from 'react';
import { FlatList, FlatListProps, ListRenderItemInfo } from 'react-native';
import { SwipeableItem, SwipeableItemAction } from './SwipeableItem';

type Actions = SwipeableItemAction[] | ((rowKey: string) => SwipeableItemAction[]);

interface SwipeableList2Props {
  leftActions?: Actions;
  rightActions?: Actions;
}

export const SwipeableList2 = <T, >({
                                      leftActions,
                                      rightActions,
                                      data,
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

  function getActionsForItem(rowKey: string, actions: Actions) {
    if (Array.isArray(actions)) {
      return actions;
    }

    return actions(rowKey);
  }

  function renderItem(info: ListRenderItemInfo<T>): React.ReactElement | null {
    const { item, index } = info;
    const rowKey = keyExtractor(item, index);

    const itemLeftActions = leftActions && getActionsForItem(rowKey, leftActions);
    const itemRightActions = rightActions && getActionsForItem(rowKey, rightActions);

    return (
      <SwipeableItem
        leftActions={itemLeftActions}
        rightActions={itemRightActions}
        autoSelectRightOuterAction
        onSwipeBegin={handleSwipeBegin}
        onSwipeEnd={handleSwipeEnd}
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
