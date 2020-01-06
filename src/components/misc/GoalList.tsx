import React, { FunctionComponent } from 'react';
import { GoalRow, GoalRowProps } from './GoalRow';
import { EmptyContainer } from './EmptyContainer';
import { SwipeableList } from './SwipeableList';
import { colors } from '../../theme';
import { Icons } from '../../../assets';
import { SwipeableItemAction } from './SwipeableItem';

export interface GoalListProps {
  goals: (GoalRowProps)[];
  /**
   * Text to show then this list is empty.
   */
  emptyText?: string;
  onLeftActionInteraction?: (goalId?: string) => void;
  onEditActionInteraction?: (goalId?: string) => void;
  disableRightSwipe?: boolean;
  onChangeScrollEnabled?: (scrollEnabled: boolean) => void;
}

export const GoalList: FunctionComponent<GoalListProps> = ({
                                                             goals, emptyText = '',
                                                             disableRightSwipe = false,
                                                             onLeftActionInteraction,
                                                             onEditActionInteraction,
                                                             onChangeScrollEnabled,
                                                           }) => {
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

  const trackOrCompleteAction = (goalId: string) => {
    const goal = findGoal(goalId);

    let icon = Icons.checkmarkLarge;
    if (goal && isGoalTracked(goal)) {
      icon = Icons.stopwatch;
    } else if (goal?.isCompleted) {
      icon = Icons.undo;
    }

    return {
      color: colors.blue,
      onInteraction: onLeftActionInteraction,
      icon,
    };
  };

  return (
    <SwipeableList
      data={goals}
      disableRightSwipe={disableRightSwipe}
      actionsLeft={[trackOrCompleteAction]}
      actionsRight={[editAction]}
      actionWidth={60}
      renderItem={({ item }: { item: GoalRowProps }) => <GoalRow {...item} />}
      autoSelectLeftOuterAction
      onChangeScrollEnabled={onChangeScrollEnabled}
    />
  );
};
