import React, { FunctionComponent, useEffect, useState } from 'react';
import { GoalRow, GoalRowProps } from './GoalRow';
import { EmptyContainer } from './EmptyContainer';
import { SwipeableList, SwipeableListHiddenAction } from './SwipeableList';
import { colors } from '../../theme';
import { Icons } from '../../../assets';

interface GoalListProps {
  goals: (GoalRowProps)[];
  /**
   * Text to show then this list is empty.
   */
  emptyText?: string;
  onLeftHiddenActionInteraction?: (goalId: string) => void;
  onEditActionInteraction?: (goalId: string) => void;
  disableRightSwipe?: boolean;
}

export const GoalList2: FunctionComponent<GoalListProps> = ({
                                                              goals, emptyText = '',
                                                              disableRightSwipe = false,
                                                              onLeftHiddenActionInteraction,
                                                              onEditActionInteraction,
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

  const editAction: SwipeableListHiddenAction<GoalRowProps> = {
    icon: Icons.edit,
    color: colors.yellow,
    onInteraction: onEditActionInteraction,
  };

  const trackOrCompleteAction: SwipeableListHiddenAction<GoalRowProps> = {
    color: colors.blue,
    onInteraction: onLeftHiddenActionInteraction,
    icon: (goalId: string) => {
      const goal = findGoal(goalId);

      if (goal && isGoalTracked(goal)) {
        return Icons.stopwatch;
      } else if (goal?.isCompleted) {
        return Icons.undo;
      }

      return Icons.checkmarkLarge;
    },
  };

  return (
    <SwipeableList
      data={goals}
      disableRightSwipe={disableRightSwipe}
      hiddenActionsLeft={[trackOrCompleteAction, editAction]}
      // hiddenActionsRight={hiddenActionsRight}
      actionWidth={60}
      renderItem={({ item }: { item: GoalRowProps }) => <GoalRow {...item} />}
      autoSelectLeftOuterAction
    />
  );
};
