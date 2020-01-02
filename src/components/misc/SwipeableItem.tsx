import React, { PureComponent } from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
  TextStyle,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native';

export interface SwipeableItemAction {
  title?: string;
  icon?: any;
  color: string;
  titleStyle?: TextStyle;
  hideRowOnInteraction?: boolean;
  onInteraction?: (key?: string) => void;
}

interface SwipeableItemProps {
  leftActions: SwipeableItemAction[];
  rightActions: SwipeableItemAction[];
  actionWidth: number;
  /**
   * When the user swipes past this amount multiplied by open value (the total width of actions
   * when they are open), the outer action is auto selected if auto select is set to `true`.
   */
  autoSelectCutOff: number;
  key?: string;
}

interface SwipeableItemState {
  translateX: Animated.Value;
  leftOuterActionWidthPercent: Animated.Value;
  rightOuterActionWidthPercent: Animated.Value;
}

type Location = 'left' | 'right';


export class SwipeableItem extends PureComponent<SwipeableItemProps, SwipeableItemState> {
  static defaultProps = {
    actionWidth: 100,
    leftActions: [],
    rightActions: [],
    autoSelectCutOff: 1.5,
  };

  xPosition = 0;

  numOfLeftActions = this.props.leftActions.length;
  numOfRightActions = this.props.rightActions.length;

  leftActionWidthsTotal = this.numOfLeftActions * this.props.actionWidth;
  rightActionWidthsTotal = this.numOfRightActions * this.props.actionWidth;

  leftOuterActionAutoSelect = this.leftActionWidthsTotal * this.props.autoSelectCutOff;
  rightOuterActionAutoSelect = -this.rightActionWidthsTotal * this.props.autoSelectCutOff;

  isLeftOuterActionAutoSelected = false;
  isRightOuterActionAutoSelected = false;

  areLeftActionsOpen = false;
  areRightActionsOpen = false;

  panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!
      // gestureState.d{x,y} will be set to zero now
      this.state.translateX.setOffset(this.xPosition);
      this.state.translateX.setValue(0);
    },
    onPanResponderMove: (evt, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}
      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}
      this.state.translateX.setValue(gestureState.dx);
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      this.state.translateX.flattenOffset();

      if ((!this.areLeftActionsOpen && !this.areRightActionsOpen) && (this.xPosition >= this.leftActionWidthsTotal / 2 || gestureState.vx > 0.1)) {
        this.openLeft(gestureState.vx);
      } else if (this.areLeftActionsOpen && this.xPosition > this.leftActionWidthsTotal / 2 && gestureState.vx >= -0.1) {
        this.openLeft(gestureState.vx);
      } else if ((!this.areRightActionsOpen && !this.areLeftActionsOpen) && (this.xPosition <= -this.rightActionWidthsTotal / 2 || gestureState.vx < -0.1)) {
        this.openRight(gestureState.vx);
      } else if (this.areRightActionsOpen && this.xPosition < -this.rightActionWidthsTotal / 2 && gestureState.vx <= 0.1) {
        this.openRight(gestureState.vx);
      } else {
        this.close(gestureState.vx);
      }
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
  });

  state = {
    translateX: new Animated.Value(0),
    leftOuterActionWidthPercent: new Animated.Value(this.numOfLeftActions > 0 ? 100 / this.numOfLeftActions : 0),
    rightOuterActionWidthPercent: new Animated.Value(this.numOfRightActions > 0 ? 100 / this.numOfRightActions : 0),
  };

  componentDidMount(): void {
    this.state.translateX.addListener(animatedValue => {
      const { value } = animatedValue;

      this.xPosition = value;
      this.autoSelectOrDeselectOuterAction(value);
    });
  }

  autoSelectOrDeselectOuterAction = (value: number) => {
    if (value >= this.leftOuterActionAutoSelect && !this.isLeftOuterActionAutoSelected) {
      this.isLeftOuterActionAutoSelected = true;
      this.runAutoSelectOuterActionAnimation('left');
    }

    if (value < this.leftOuterActionAutoSelect && this.isLeftOuterActionAutoSelected) {
      this.isLeftOuterActionAutoSelected = false;
      this.runAutoDeselectOuterActionAnimation('left');
    }

    if (value <= this.rightOuterActionAutoSelect && !this.isRightOuterActionAutoSelected) {
      this.isRightOuterActionAutoSelected = true;
      this.runAutoSelectOuterActionAnimation('right');
    }

    if (value > this.rightOuterActionAutoSelect && this.isRightOuterActionAutoSelected) {
      this.isRightOuterActionAutoSelected = false;
      this.runAutoDeselectOuterActionAnimation('right');
    }
  };

  componentWillUnmount(): void {
    this.state.translateX.removeAllListeners();
  }

  close(velocity = 0): void {
    Animated.spring(
      this.state.translateX,
      this.openCloseAnimationConfiguration(0, velocity),
    ).start(() => {
      this.areLeftActionsOpen = false;
      this.areRightActionsOpen = false;
    });
  }

  openLeft(velocity = 0): void {
    this.openTo(this.leftActionWidthsTotal, velocity);
  }

  openRight(velocity = 0): void {
    this.openTo(-this.rightActionWidthsTotal, velocity);
  }

  openTo = (x: number, velocity = 0) => {
    Animated.spring(
      this.state.translateX,
      this.openCloseAnimationConfiguration(x, velocity),
    ).start(() => {
      if (x >= this.leftActionWidthsTotal) {
        this.areLeftActionsOpen = true;
      } else if (x <= -this.rightActionWidthsTotal) {
        this.areRightActionsOpen = true;
      }
    });
  };

  openCloseAnimationConfiguration = (toValue: number, velocity: number) => ({
    toValue,
    overshootClamping: true,
    velocity,
    friction: 100,
    tension: 100,
  });

  autoSelectAnimationConfiguration = (toValue: number) => ({
    toValue,
    overshootClamping: true,
    friction: 100,
    tension: 100,
  });

  runAutoSelectOuterActionAnimation = (location: Location) => {
    const widthPercent = location === 'left' ? this.state.leftOuterActionWidthPercent : this.state.rightOuterActionWidthPercent;

    Animated.spring(
      widthPercent,
      this.autoSelectAnimationConfiguration(100),
    ).start();
  };

  runAutoDeselectOuterActionAnimation = (location: Location) => {
    const widthPercent = location === 'left' ? this.state.leftOuterActionWidthPercent : this.state.rightOuterActionWidthPercent;
    const toValue = this.outerActionWidthPercentWhenNotAutoSelected(location);

    Animated.spring(
      widthPercent,
      this.autoSelectAnimationConfiguration(toValue),
    ).start();
  };

  outerActionWidthPercentWhenNotAutoSelected = (location: Location) => {
    const numOfActions = location === 'left' ? this.numOfLeftActions : this.numOfRightActions;

    if (numOfActions === 0) return 0;

    return 100 / numOfActions;
  };

  renderOuterAction = (action: SwipeableItemAction, location: Location) => this.renderAction(action, location, true);

  renderAction = (action: SwipeableItemAction, location: 'left' | 'right', outerAction = false) => {
    const { title, icon, color, titleStyle, onInteraction } = action;

    let style: any[];

    const commonStyle = {
      backgroundColor: color,
      alignItems: location === 'left' ? 'flex-end' : 'flex-start',
    };

    if (outerAction) {
      const widthPercent = location === 'left' ? this.state.leftOuterActionWidthPercent : this.state.rightOuterActionWidthPercent;

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
      width: this.props.actionWidth,
    }];

    return (
      <TouchableWithoutFeedback onPress={() => onInteraction?.(this.props.key)}>
        <Animated.View style={style}>
          <View style={contentStyle}>
            {icon && (<Image source={icon} />)}
            {title && (<Text style={titleStyle}>{title}</Text>)}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  renderLeftActions = () => {
    return <Animated.View style={[styles.hiddenActionsContainer, {
      left: 0,
      width: this.state.translateX.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 0, 1],
      }),
    }]}>
      <Animated.View style={styles.fillerAction} />
      {this.props.leftActions?.map((action, index) => {
        return index === 0 ? this.renderOuterAction(action, 'left') : this.renderAction(action, 'left');
      })}
    </Animated.View>;
  };

  renderRightActions = () => {
    return <Animated.View style={[styles.hiddenActionsContainer, {
      right: 0,
      width: this.state.translateX.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [1, 0, 0],
      }),
    }]}>
      {this.props.rightActions?.map((action, index) => {
        return index === this.numOfRightActions - 1 ? this.renderOuterAction(action, 'right') : this.renderAction(action, 'right');
      })}
      <Animated.View style={styles.fillerAction} />
    </Animated.View>;
  };

  render() {
    const transformStyle = {
      transform: [{ translateX: this.state.translateX }],
    };

    return (
      <View style={{ flexDirection: 'row' }}>
        {this.numOfLeftActions > 0 && this.renderLeftActions()}
        <Animated.View style={[{ width: '100%' }, transformStyle]} {...this.panResponder.panHandlers}>
          {this.props.children}
        </Animated.View>
        {this.numOfRightActions > 0 && this.renderRightActions()}
      </View>
    );
  }
}

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
