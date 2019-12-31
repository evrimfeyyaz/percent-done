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
  width?: number;
  titleStyle?: TextStyle;
  hideRowOnInteraction?: boolean;
  onInteraction?: (id: string) => void;
}

interface SwipeableItemProps {
  leftActions?: SwipeableItemAction[];
  rightActions?: SwipeableItemAction[];
}

export const SwipeableItem: FunctionComponent<SwipeableItemProps> = ({ leftActions, rightActions, children }) => {
  const [translateX] = useState(new Animated.Value(0));

  const xPosition = useRef(0);
  const areLeftActionsOpen = useRef(false);
  const areRightActionsOpen = useRef(false);

  const leftActionWidthsTotal = useMemo(() => getActionWidthsTotal(leftActions), [leftActions]);
  const rightActionWidthsTotal = useMemo(() => getActionWidthsTotal(rightActions), [rightActions]);

  function getActionWidthsTotal(actions?: SwipeableItemAction[]) {
    return actions?.reduce((total, action) => total + (action.width ?? 0), 0) ?? 0;
  }

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
      Animated.timing(translateX, {
        toValue: animateTo,
        duration: 500,
        easing: Easing.out(Easing.poly(4)),
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

  function renderAction(action: SwipeableItemAction, id: string, location: 'left' | 'right', outerAction = false) {
    const { title, icon, color, width, titleStyle } = action;

    let style: any[];

    const commonStyle = {
      backgroundColor: color,
      alignItems: location === 'left' ? 'flex-end' : 'flex-start',
    };

    style = [styles.hiddenAction, commonStyle, {
      flex: 1,
    }];

    const contentStyle = [styles.hiddenActionContentStyle, {
      width,
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
        backgroundColor: 'yellow', left: 0, width: translateX.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0, 0, 1],
        }),
      }]}>
        {leftActions?.map(action => renderAction(action, 'no-id', 'left'))}
      </Animated.View>
      <Animated.View style={[{ width: '100%' }, transformStyle]} {...panResponder.panHandlers}>
        {children}
      </Animated.View>
      <Animated.View style={[styles.hiddenActionsContainer, {
        backgroundColor: 'green', right: 0, width: translateX.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [1, 0, 0],
        }),
      }]}>
        {rightActions?.map(action => renderAction(action, 'no-id', 'right'))}
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
});
