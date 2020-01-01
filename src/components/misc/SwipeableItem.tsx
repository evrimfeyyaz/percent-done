import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
  TextStyle,
  TouchableWithoutFeedback,
  Image,
  StyleSheet, Easing,
} from 'react-native';

export interface SwipeableItemAction {
  title?: string;
  icon?: any;
  color: string;
  titleStyle?: TextStyle;
  hideRowOnInteraction?: boolean;
  onInteraction?: (id: string) => void;
}

interface SwipeableItemProps {
  leftActions?: SwipeableItemAction[];
  rightActions?: SwipeableItemAction[];
  actionWidth?: number;
}

export const SwipeableItem: FunctionComponent<SwipeableItemProps> = ({ leftActions, rightActions, actionWidth = 100, children }) => {
  const leftActionsLength = leftActions?.length ?? 0;
  const rightActionsLength = rightActions?.length ?? 0;
  const leftActionWidthsTotal = leftActionsLength * actionWidth;
  const rightActionWidthsTotal = rightActionsLength * actionWidth;

  const [translateX] = useState(new Animated.Value(0));
  const [leftOuterActionWidthPercent] = useState(new Animated.Value(leftActionsLength > 0 ? 100 / leftActionsLength : 0));
  const [rightOuterActionWidthPercent] = useState(new Animated.Value(rightActionsLength > 0 ? 100 / rightActionsLength : 0));

  const xPosition = useRef(0);
  const areLeftActionsOpen = useRef(false);
  const areRightActionsOpen = useRef(false);

  useEffect(() => {
    translateX.addListener((animatedValue) => xPosition.current = animatedValue.value);

    return () => translateX.removeAllListeners();
  }, []);

  const panResponder = useMemo(() => PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!
      // gestureState.d{x,y} will be set to zero now
      translateX.setOffset(xPosition.current);
      translateX.setValue(0);
    },
    onPanResponderMove: (evt, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}
      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}
      translateX.setValue(gestureState.dx);
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      let animateTo = 0;
      if ((!areLeftActionsOpen.current && !areRightActionsOpen.current) && (xPosition.current >= leftActionWidthsTotal / 2 || gestureState.vx > 0.1)) {
        animateTo = leftActionWidthsTotal;
      } else if (areLeftActionsOpen.current && xPosition.current > leftActionWidthsTotal / 2 && gestureState.vx >= -0.1) {
        animateTo = leftActionWidthsTotal;
      } else if ((!areRightActionsOpen.current && !areLeftActionsOpen.current) && (xPosition.current <= -rightActionWidthsTotal / 2 || gestureState.vx < -0.1)) {
        animateTo = -rightActionWidthsTotal;
      } else if (areRightActionsOpen.current && xPosition.current < -rightActionWidthsTotal / 2 && gestureState.vx <= 0.1) {
        animateTo = -rightActionWidthsTotal;
      }

      translateX.flattenOffset();
      Animated.spring(translateX, {
        toValue: animateTo,
        overshootClamping: true,
        velocity: gestureState.vx,
        friction: 100,
        tension: 100,
      }).start(() => {
        if (animateTo === leftActionWidthsTotal) {
          areLeftActionsOpen.current = true;
        } else if (animateTo === -rightActionWidthsTotal) {
          areRightActionsOpen.current = true;
        } else {
          areLeftActionsOpen.current = false;
          areRightActionsOpen.current = false;
        }
      });
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // Returns whether this component should block native components from becoming the JS
      // responder. Returns true by default. Is currently only supported on android.
      return true;
    },
  }), []);

  function renderOuterAction(action: SwipeableItemAction, id: string, location: 'left' | 'right') {
    return renderAction(action, id, location, true);
  }

  function renderAction(action: SwipeableItemAction, id: string, location: 'left' | 'right', outerAction = false) {
    const { title, icon, color, titleStyle } = action;

    let style: any[];

    const commonStyle = {
      backgroundColor: color,
      alignItems: location === 'left' ? 'flex-end' : 'flex-start',
    };

    if (outerAction) {
      const widthPercent = location === 'left' ? leftOuterActionWidthPercent : rightOuterActionWidthPercent;

      style = [styles.hiddenAction, commonStyle, {
        zIndex: 9999,
        position: 'absolute',
        right: location === 'right' ? 0 : undefined,
        left: location === 'left' ? 0 : undefined,
        width: widthPercent.interpolate({
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
      <TouchableWithoutFeedback>
        <Animated.View style={style}>
          <View style={contentStyle}>
            {icon && (<Image source={icon} />)}
            {title && (<Text style={titleStyle}>{title}</Text>)}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  const transformStyle = {
    transform: [{ translateX }],
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <Animated.View style={[styles.hiddenActionsContainer, {
        left: 0,
        width: translateX.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0, 0, 1],
        }),
      }]}>
        {leftActionsLength > 0 && (<Animated.View style={styles.fillerAction} />)}
        {leftActions?.map((action, index) => {
          return index === 0 ? renderOuterAction(action, 'no-id', 'left') : renderAction(action, 'no-id', 'left');
        })}
      </Animated.View>
      <Animated.View style={[{ width: '100%' }, transformStyle]} {...panResponder.panHandlers}>
        {children}
      </Animated.View>
      <Animated.View style={[styles.hiddenActionsContainer, {
        position: 'absolute',
        right: 0,
        width: translateX.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [1, 0, 0],
        }),
      }]}>
        {rightActions?.map((action, index) => {
          return index === rightActionsLength - 1 ? renderOuterAction(action, 'no-id', 'right') : renderAction(action, 'no-id', 'right');
        })}
        {rightActionsLength > 0 && (<Animated.View style={styles.fillerAction} />)}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenActionsContainer: {
    flexDirection: 'row',
    height: '100%',
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
