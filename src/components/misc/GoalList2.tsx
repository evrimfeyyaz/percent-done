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
  onRightHiddenActionInteraction?: (goalId: string) => void;
  disableRightSwipe?: boolean;
}

export const GoalList2: FunctionComponent<GoalListProps> = ({
                                                              goals, emptyText = '',
                                                              disableRightSwipe = false,
                                                              onLeftHiddenActionInteraction,
                                                              onRightHiddenActionInteraction,
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

  const hiddenActionsRight: SwipeableListHiddenAction<GoalRowProps>[] = [
    {
      icon: Icons.edit,
      color: colors.yellow,
      onInteraction: onRightHiddenActionInteraction,
    },
  ];

  let hiddenActionsLeft = (goalId: string): SwipeableListHiddenAction<GoalRowProps>[] => {
    const goal = findGoal(goalId);

    const hiddenAction: SwipeableListHiddenAction<GoalRowProps> = {
      color: colors.blue,
      onInteraction: onLeftHiddenActionInteraction,
    };

    if (goal && isGoalTracked(goal)) {
      hiddenAction.icon = Icons.stopwatch;
    } else if (goal?.isCompleted) {
      hiddenAction.icon = Icons.undo;
    } else {
      hiddenAction.icon = Icons.checkmarkLarge;
    }

    return [hiddenAction];
  };

  return (
    <SwipeableList
      data={goals}
      disableRightSwipe={disableRightSwipe}
      hiddenActionsLeft={hiddenActionsLeft}
      hiddenActionsRight={hiddenActionsRight}
      actionWidth={60}
      renderItem={({ item }: { item: GoalRowProps }) => <GoalRow {...item} />}
      autoSelectLeftOuterAction
    />
  );
};
