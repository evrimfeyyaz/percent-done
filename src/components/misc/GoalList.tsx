import React, { FunctionComponent, useEffect, useState } from 'react';
import { GoalRow, GoalRowProps } from './GoalRow';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import {
  Animated,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  View,
  Text,
  LayoutAnimation, TouchableWithoutFeedback,
} from 'react-native';
import { colors, fonts } from '../../theme';
import { Icons } from '../../../assets';

export interface GoalListProps {
  goals: (GoalRowProps)[];
  /**
   * Text to show then this list is empty.
   */
  emptyText?: string;
  onGoalRightSwipe?: (goalId: string) => void;
  onRightActionPress?: (goalId: string) => void;
}

export const GoalList: FunctionComponent<GoalListProps> = ({ goals, emptyText = '', onGoalRightSwipe, onRightActionPress }) => {
  if (goals.length === 0) {
    return (
      <View style={styles.emptyTextContainer}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  let isSwipeAnimationRunning = false;

  const [listWidth, setListWidth] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [itemSwipeDirections, setItemSwipeDirections] = useState<{ [key: string]: 'left' | 'right' }>({});

  const itemSwipeValues: { [key: string]: Animated.Value } = {};
  const goalVisibilityValues: { [key: string]: Animated.Value } = {};
  goals.forEach(goal => {
    itemSwipeValues[goal.id] = new Animated.Value(0);
    goalVisibilityValues[goal.id] = new Animated.Value(1);
  });

  useEffect(() => {
    const swipeDirections: typeof itemSwipeDirections = {};
    goals.forEach(goal => {
      swipeDirections[goal.id] = 'left';
    });

    setItemSwipeDirections(swipeDirections);
  }, [goals]);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      return;
    }

    LayoutAnimation.easeInEaseOut();
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

    if (value > 0 && itemSwipeDirections[key] === 'left') {
      setItemSwipeDirections({ ...itemSwipeDirections, [key]: 'right' });
    } else if (value < 0 && itemSwipeDirections[key] === 'right') {
      setItemSwipeDirections({ ...itemSwipeDirections, [key]: 'left' });
    }

    itemSwipeValues[key].setValue(Math.abs(value));

    if (value > listWidth && !isSwipeAnimationRunning && itemSwipeDirections[key] === 'right') {
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

    if (goal != null && isGoalTracked(goal) && itemSwipeDirections[key] === 'right') {
      onGoalRightSwipe?.(key);
    }
  };

  const handleRowDidOpen = (key: string, rowMap: RowMap<GoalRowProps>) => {
    const goal = goals.find(goal => goal.id === key);

    if (goal != null && isGoalTracked(goal)) {
      goalVisibilityValues[key].setValue(1);
      if (itemSwipeDirections[key] === 'right') {
        rowMap[key].closeRow();
      }
    }
  };

  const handleHiddenItemPress = (goalId: string) => {
    if (itemSwipeDirections[goalId] === 'left') {
      onRightActionPress?.(goalId);
    }
  };

  const actionStyle = (goalId: string) => {
    return StyleSheet.flatten([
      styles.action, {
        right: itemSwipeDirections[goalId] === 'left' ? 0 : undefined,
        backgroundColor: itemSwipeDirections[goalId] === 'left' ? colors.yellow : colors.blue,
        opacity: goalVisibilityValues[goalId],
        width: itemSwipeValues[goalId],
      },
    ] as any);
  };

  const actionIconStyle = (goalId: string) => StyleSheet.flatten([
    styles.actionIconContainer, {
      right: itemSwipeDirections[goalId] === 'left' ? itemSwipeValues[goalId].interpolate({
        inputRange: [30, 60],
        outputRange: [0, 24],
        extrapolate: 'clamp',
      }) : undefined,
      left: itemSwipeDirections[goalId] === 'right' ? itemSwipeValues[goalId].interpolate({
        inputRange: [30, 60],
        outputRange: [0, 24],
        extrapolate: 'clamp',
      }) : undefined,
      transform: [{
        scale: itemSwipeValues[goalId].interpolate({
          inputRange: [30, 60],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
      }],
    }] as any);

  const goalStyle = (goalId: string) => ({
    opacity: goalVisibilityValues[goalId],
  });

  const isGoalTracked = (goal: GoalRowProps) => (goal.isCompleted == null);

  const actionIcon = (goal: GoalRowProps) => {
    if (itemSwipeDirections[goal.id] === 'left') {
      return Icons.edit;
    }

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
        <TouchableWithoutFeedback onPress={() => handleHiddenItemPress(data.item.id)}>
          <Animated.View
            style={actionStyle(data.item.id)}>
            <Animated.View style={actionIconStyle(data.item.id)}>
              <Image source={actionIcon(data.item)} />
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      keyExtractor={item => item.id}
      onSwipeValueChange={handleSwipeValueChange}
      closeOnRowOpen={false}
      closeOnRowBeginSwipe={true}
      closeOnRowPress={true}
      onRowOpen={handleRowOpen}
      onRowDidOpen={handleRowDidOpen}
      onLayout={handleSwipeListViewLayout}
      leftOpenValue={listWidth}
      rightOpenValue={-70}
      swipeToOpenPercent={30}
      swipeToOpenVelocityContribution={15}
    />
  );
};

const styles = StyleSheet.create({
  action: {
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    position: 'absolute',
  },
  actionIconContainer: {
    maxWidth: 74,
    position: 'absolute',
  },
  emptyTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    opacity: .3,
  },
});
