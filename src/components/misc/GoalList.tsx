import React, { FunctionComponent, useEffect } from 'react';
import { GoalRow, GoalRowProps } from './GoalRow';
import { EmptyContainer } from './EmptyContainer';
import { SwipeableList } from './SwipeableList';
import { colors, fonts } from '../../theme';
import { Icons } from '../../../assets';
import { SwipeableItemAction } from './SwipeableItem';
import { LayoutAnimation, StyleSheet } from 'react-native';

export interface GoalListProps {
  goals: GoalRowProps[];
  /**
   * Text to show then this list is empty.
   */
  emptyText?: string;
  onCompleteOrTrackActionInteraction?: (goalId?: string) => void;
  onEditActionInteraction?: (goalId?: string) => void;
  disableRightSwipe?: boolean;
  onChangeScrollEnabled?: (scrollEnabled: boolean) => void;
}

export const GoalList: FunctionComponent<GoalListProps> = ({
                                                             goals, emptyText = '',
                                                             disableRightSwipe = false,
                                                             onCompleteOrTrackActionInteraction,
                                                             onEditActionInteraction,
                                                             onChangeScrollEnabled,
                                                           }) => {
  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, [goals]);

  function isGoalTracked(goal: GoalRowProps) {
    return goal.isCompleted == null;
  }

  function findGoal(id: string) {
    return goals.find(goal => goal.id === id);
  }

  if (goals.length === 0) {
    return <EmptyContainer text={emptyText} />;
  }

  const editAction: SwipeableItemAction = {
    icon: Icons.edit,
    color: colors.yellow,
    onInteraction: onEditActionInteraction,
  };

  const actionsLeft = (goalId: string): SwipeableItemAction[] => {
    const goal = findGoal(goalId);

    let icon = Icons.checkmarkLarge;
    let hideRowOnInteraction = true;
    if (goal && isGoalTracked(goal)) {
      icon = Icons.stopwatch;
      hideRowOnInteraction = false;
    } else if (goal?.isCompleted) {
      icon = Icons.undo;
    }

    return [{
      color: colors.blue,
      onInteraction: onCompleteOrTrackActionInteraction,
      icon,
      hideRowOnInteraction,
    }];
  };

  return (
    <SwipeableList
      data={goals}
      disableRightSwipe={disableRightSwipe}
      actionsLeft={actionsLeft}
      actionsRight={[editAction]}
      actionWidth={73}
      renderItem={({ item }: { item: GoalRowProps }) => <GoalRow {...item} />}
      autoSelectLeftOuterAction
      onChangeScrollEnabled={onChangeScrollEnabled}
      keyExtractor={item => item.id}
      titleStyle={styles.actionTitle}
    />
  );
};

const styles = StyleSheet.create({
  actionTitle: {
    color: colors.white,
    fontFamily: fonts.regular,
  },
});
