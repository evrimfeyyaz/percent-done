import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, PanResponder, Animated } from 'react-native';

export const SwipeableItem: FunctionComponent = ({ children }) => {
  const [translateX] = useState(new Animated.Value(0));
  const xPosition = useRef(0);

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
      translateX.flattenOffset();
      Animated.spring(translateX, {
        toValue: 0,
      }).start();
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

  const transformStyle = {
    transform: [{ translateX }],
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <Animated.View style={{
        backgroundColor: 'yellow', position: 'absolute', left: 0, width: translateX.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0, 0, 1],
        }), height: '100%',
      }}>
        <Text style={{alignSelf: 'center'}}>Test</Text>
      </Animated.View>
      <Animated.View style={[{ width: '100%' }, transformStyle]} {...panResponder.panHandlers}>
        {children}
      </Animated.View>
      <Animated.View style={{
        backgroundColor: 'green', position: 'absolute', right: 0, width: translateX.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [1, 0, 0],
        }), height: '100%',
      }}>
        <Text style={{alignSelf: 'center'}}>Test</Text>
      </Animated.View>
    </View>
  );
};
