import React, { FunctionComponent, useEffect, useState } from 'react';
import { GoalRow, GoalRowProps } from './GoalRow';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { Animated, Image, LayoutChangeEvent, StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';
import { Icons } from '../../../assets';
import { usePrevious } from '../../utilities';
import _ from 'lodash';

export interface GoalListProps {
  goals: (GoalRowProps)[];
  onGoalRightSwipe?: (goalId: string) => void;
}

export const GoalList: FunctionComponent<GoalListProps> = ({ goals = [], onGoalRightSwipe }) => {
  let isSwipeAnimationRunning = false;

  const leftItemSwipeValues: { [key: string]: Animated.Value } = {};
  const goalVisibilityValues: { [key: string]: Animated.Value } = {};
  goals.forEach(goal => {
    leftItemSwipeValues[goal.id] = new Animated.Value(0);
    goalVisibilityValues[goal.id] = new Animated.Value(1);
  });

  const [listWidth, setListWidth] = useState(0);

  const prevGoals = usePrevious(goals);

  useEffect(() => {
    if (goals == null || prevGoals == null) return;

    const newGoals = _.differenceBy<GoalRowProps, GoalRowProps>(goals, prevGoals, goal => goal.id);

    newGoals.map(goal => goal.id).forEach((goalId) => {
      goalVisibilityValues[goalId].setValue(0);

      Animated.timing(goalVisibilityValues[goalId], { toValue: 1, duration: 300 }).start();
    });
  }, [goals]);

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

    leftItemSwipeValues[key].setValue(Math.max(value, 0));

    if (value > listWidth && !isSwipeAnimationRunning) {
      const goal = goals.find(goal => goal.id === key);
      if (goal != null && isGoalTracked(goal)) return;

      isSwipeAnimationRunning = true;

      Animated.timing(goalVisibilityValues[key], { toValue: 0, duration: 300 }).start(() => {
        onGoalRightSwipe?.(key);
        isSwipeAnimationRunning = false;
      });
    }
  };

  const handleRowOpen = (key: string) => {
    const goal = goals.find(goal => goal.id === key);

    if (goal != null && isGoalTracked(goal)) { // Goal is a time-tracked goal.
      onGoalRightSwipe?.(key);
    }
  };

  const handleRowDidOpen = (key: string, rowMap: RowMap<GoalRowProps>) => {
    const goal = goals.find(goal => goal.id === key);

    if (goal != null && isGoalTracked(goal)) { // Goal is a time-tracked goal.
      goalVisibilityValues[key].setValue(1);
      rowMap[key].closeRow();
    }
  };

  const leftActionStyle = (goalId: string) => {
    // @ts-ignore
    return StyleSheet.flatten([
      styles.leftAction, {
        opacity: goalVisibilityValues[goalId],
        width: leftItemSwipeValues[goalId],
      },
    ]);
  };

  // @ts-ignore
  const leftActionIconStyle = (goalId: string) => StyleSheet.flatten([styles.leftActionIconContainer, {
    transform: [{
      scale: leftItemSwipeValues[goalId].interpolate({
        inputRange: [30, 60],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    }],
  }]);

  const goalStyle = (goalId: string) => ({
    opacity: goalVisibilityValues[goalId],
  });

  const isGoalTracked = (goal: GoalRowProps) => (goal.isCompleted == null);

  const leftActionIcon = (goal: GoalRowProps) => {
    if (isGoalTracked(goal)) {
      return Icons.stopwatch;
    }

    if (goal.isCompleted === true) {
      return Icons.undo;
    } else {
      return Icons.checkmarkLarge;
    }
  };

  return (
    <SwipeListView
      data={goals}
      renderItem={(data: any) => <GoalRow {...data.item} style={goalStyle(data.item.id)} />}
      renderHiddenItem={(data: any) => (
        <Animated.View
          style={leftActionStyle(data.item.id)}>
          <Animated.View style={leftActionIconStyle(data.item.id)}>
            <Image source={leftActionIcon(data.item)} />
          </Animated.View>
        </Animated.View>
      )}
      keyExtractor={item => item.id}
      onSwipeValueChange={handleSwipeValueChange}
      closeOnRowOpen={false}
      closeOnRowBeginSwipe={false}
      closeOnRowPress={false}
      closeOnScroll={false}
      disableLeftSwipe
      onRowOpen={handleRowOpen}
      onRowDidOpen={handleRowDidOpen}
      onLayout={handleSwipeListViewLayout}
      leftOpenValue={listWidth}
      swipeToOpenPercent={30}
      swipeToOpenVelocityContribution={15}
    />
  );
};

const styles = StyleSheet.create({
  leftAction: {
    height: '100%',
    overflow: 'hidden',
    backgroundColor: colors.blue,
    justifyContent: 'center',
  },
  leftActionText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.white,
    marginStart: 12,
  },
  leftActionIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 74,
  },
});
