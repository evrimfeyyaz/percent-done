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
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

type Location = 'left' | 'right';
type InteractionCallback = (key?: string) => void;

export interface SwipeableItemAction {
  title?: string;
  icon?: any;
  color: string;
  titleStyle?: TextStyle;
  hideRowOnInteraction?: boolean;
  onInteraction?: InteractionCallback;
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

export class SwipeableItem extends PureComponent<SwipeableItemProps, SwipeableItemState> {
  private static defaultProps = {
    actionWidth: 100,
    leftActions: [],
    rightActions: [],
    autoSelectCutOff: 1.5,
  };
  state = {
    translateX: new Animated.Value(0),
    leftOuterActionWidthPercent: new Animated.Value(this.outerActionWidthPercentWhenNotAutoSelected('left')),
    rightOuterActionWidthPercent: new Animated.Value(this.outerActionWidthPercentWhenNotAutoSelected('right')),
  };

  private xPosition = 0;

  private numOfLeftActions = this.props.leftActions.length;
  private numOfRightActions = this.props.rightActions.length;

  private leftOuterAction = this.numOfLeftActions > 0 ? this.props.leftActions[0] : undefined;
  private rightOuterAction = this.numOfRightActions > 0 ? this.props.rightActions[this.numOfRightActions - 1] : undefined;

  private leftActionWidthsTotal = this.numOfLeftActions * this.props.actionWidth;
  private rightActionWidthsTotal = this.numOfRightActions * this.props.actionWidth;

  private leftOuterActionAutoSelect = this.leftActionWidthsTotal * this.props.autoSelectCutOff;
  private rightOuterActionAutoSelect = -this.rightActionWidthsTotal * this.props.autoSelectCutOff;

  private isLeftOuterActionAutoSelected = false;
  private isRightOuterActionAutoSelected = false;

  private areLeftActionsOpen = false;
  private areRightActionsOpen = false;

  private isClosing = false;

  private panResponder = PanResponder.create({
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

      if (this.isLeftOuterActionAutoSelected && this.leftOuterAction != null) {
        this.handleInteraction(this.leftOuterAction.onInteraction);
      }

      if (this.isRightOuterActionAutoSelected && this.rightOuterAction != null) {
        this.handleInteraction(this.rightOuterAction.onInteraction);
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

  private handleInteraction = (callback?: InteractionCallback) => {
    this.close();
    callback?.(this.props.key);
  };

  private autoSelectAnimationConfiguration = (toValue: number) => ({
    toValue,
    overshootClamping: true,
    friction: 100,
    tension: 100,
  });

  private openCloseAnimationConfiguration = (toValue: number, velocity: number) => ({
    toValue,
    overshootClamping: true,
    velocity,
    friction: 100,
    tension: 100,
  });

  private autoSelectOrDeselectOuterAction(value: number): void {
    if (value >= this.leftOuterActionAutoSelect && !this.isLeftOuterActionAutoSelected) {
      this.isLeftOuterActionAutoSelected = true;
      this.giveHapticFeedback();
      this.runAutoSelectOuterActionAnimation('left');
    }

    if (value < this.leftOuterActionAutoSelect && this.isLeftOuterActionAutoSelected) {
      this.isLeftOuterActionAutoSelected = false;
      this.giveHapticFeedback();
      this.runAutoDeselectOuterActionAnimation('left');
    }

    if (value <= this.rightOuterActionAutoSelect && !this.isRightOuterActionAutoSelected) {
      this.isRightOuterActionAutoSelected = true;
      this.giveHapticFeedback();
      this.runAutoSelectOuterActionAnimation('right');
    }

    if (value > this.rightOuterActionAutoSelect && this.isRightOuterActionAutoSelected) {
      this.isRightOuterActionAutoSelected = false;
      this.giveHapticFeedback();
      this.runAutoDeselectOuterActionAnimation('right');
    }
  }

  private runAutoSelectOuterActionAnimation(location: Location): void {
    const widthPercent = location === 'left' ? this.state.leftOuterActionWidthPercent : this.state.rightOuterActionWidthPercent;

    Animated.spring(
      widthPercent,
      this.autoSelectAnimationConfiguration(100),
    ).start();
  }

  private runAutoDeselectOuterActionAnimation(location: Location): void {
    const widthPercent = location === 'left' ? this.state.leftOuterActionWidthPercent : this.state.rightOuterActionWidthPercent;
    const toValue = this.outerActionWidthPercentWhenNotAutoSelected(location);

    Animated.spring(
      widthPercent,
      this.autoSelectAnimationConfiguration(toValue),
    ).start();
  }

  private outerActionWidthPercentWhenNotAutoSelected(location: Location): number {
    const numOfActions = location === 'left' ? this.numOfLeftActions : this.numOfRightActions;

    if (numOfActions === 0) return 0;

    return 100 / numOfActions;
  };

  private giveHapticFeedback(): void {
    if (this.isClosing) return;

    ReactNativeHapticFeedback.trigger('impactLight');
  }

  private openTo(x: number, velocity = 0) {
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
  }

  private renderOuterAction(action: SwipeableItemAction, location: Location): JSX.Element {
    return this.renderAction(action, location, true);
  }

  private renderAction(action: SwipeableItemAction, location: Location, outerAction = false): JSX.Element {
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
      <TouchableWithoutFeedback onPress={() => this.handleInteraction(onInteraction)}>
        <Animated.View style={style}>
          <View style={contentStyle}>
            {icon && (<Image source={icon} />)}
            {title && (<Text style={titleStyle}>{title}</Text>)}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  private renderLeftActions(): JSX.Element {
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

  private renderRightActions(): JSX.Element {
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

  componentDidMount(): void {
    this.state.translateX.addListener(animatedValue => {
      const { value } = animatedValue;

      this.xPosition = value;
      this.autoSelectOrDeselectOuterAction(value);
    });
  }

  componentWillUnmount(): void {
    this.state.translateX.removeAllListeners();
  }

  close(velocity = 0): void {
    this.isClosing = true;

    Animated.spring(
      this.state.translateX,
      this.openCloseAnimationConfiguration(0, velocity),
    ).start(() => {
      this.isClosing = false;
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
