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
export type InteractionCallback = (interactionKey?: string) => void;

export interface SwipeableItemAction {
  title?: string;
  icon?: any;
  color: string;
  titleStyle?: TextStyle;
  hideRowOnInteraction?: boolean;
  onInteraction?: InteractionCallback;
}

interface SwipeableItemProps {
  actionsLeft: SwipeableItemAction[];
  actionsRight: SwipeableItemAction[];
  actionWidth: number;
  /**
   * When the user swipes past this amount multiplied by open value (the total width of actions
   * when they are open), the actions are opened, and vice versa.
   */
  openCutoffMultiplier: number;
  /**
   * When the user swipes past this amount multiplied by open value (the total width of actions
   * when they are open), the outer action is auto selected if auto select is set to `true`.
   */
  autoSelectCutOffMultiplier: number;
  autoSelectLeftOuterAction: boolean;
  autoSelectRightOuterAction: boolean;
  /**
   * Swipes with the absolute distance of less than this value are ignored.
   */
  minRegisteredSwipeDistance: number;
  /**
   * When the user swipes faster than this velocity value, the action
   * on the relevant side is open/closed regardless of the swipe distance.
   */
  minVelocityToOpen: number;
  disableLeftSwipe: boolean;
  disableRightSwipe: boolean;
  titleStyle?: TextStyle;
  onSwipeBegin?: (interactionKey?: string) => void;
  onSwipeEnd?: (interactionKey?: string) => void;
  onPress?: (interactionKey?: string) => void;
  onLeftActionsWillOpen?: (interactionKey?: string) => void;
  onLeftActionsDidOpen?: (interactionKey?: string) => void;
  onRightActionsWillOpen?: (interactionKey?: string) => void;
  onRightActionsDidOpen?: (interactionKey?: string) => void;
  onActionsWillClose?: (interactionKey?: string) => void;
  onActionsDidClose?: (interactionKey?: string) => void;
  interactionKey?: string;
}

interface SwipeableItemState {
  translateX: Animated.Value;
  leftOuterActionWidthPercent: Animated.Value;
  rightOuterActionWidthPercent: Animated.Value;
}

export class SwipeableItem extends PureComponent<SwipeableItemProps, SwipeableItemState> {
  static defaultProps = {
    actionsLeft: [],
    actionsRight: [],
    actionWidth: 100,
    openCutoffMultiplier: 0.5,
    autoSelectCutOffMultiplier: 1.5,
    minRegisteredSwipeDistance: 10,
    minVelocityToOpen: 0.1,
    autoSelectLeftOuterAction: false,
    autoSelectRightOuterAction: false,
    disableLeftSwipe: false,
    disableRightSwipe: false,
  };

  private xPosition = 0;

  private isLeftOuterActionAutoSelected = false;
  private isRightOuterActionAutoSelected = false;

  private areLeftActionsOpen = false;
  private areRightActionsOpen = false;

  private isClosing = false;

  private numOfLeftActions = () => this.props.actionsLeft.length;
  private numOfRightActions = () => this.props.actionsRight.length;

  private leftOuterAction = () => this.numOfLeftActions() > 0 ? this.props.actionsLeft[0] : undefined;
  private rightOuterAction = () => this.numOfRightActions() > 0 ? this.props.actionsRight[this.numOfRightActions() - 1] : undefined;

  private leftActionWidthsTotal = () => this.numOfLeftActions() * this.props.actionWidth;
  private rightActionWidthsTotal = () => this.numOfRightActions() * this.props.actionWidth;

  // When the user swipes past these values, the swipe is
  // slowed down to show that there are no more actions to show.
  private slowDownRightSwipeAfter = () => this.props.autoSelectLeftOuterAction ? this.leftOuterActionAutoSelectSwipeValue() : this.leftOpenValue();
  private slowDownLeftSwipeAfter = () => this.props.autoSelectRightOuterAction ? this.rightOuterActionAutoSelectSwipeValue() : this.rightOpenValue();

  // The "x translation" value of the swipeable item in left or
  // right open positions.
  private leftOpenValue = () => this.leftActionWidthsTotal();
  private rightOpenValue = () => -this.rightActionWidthsTotal();

  // When the user swipes more than or equal to these values,
  // and the relevant auto select prop is `true`, the auto
  // select animation is executed.
  private leftOuterActionAutoSelectSwipeValue = () => this.leftOpenValue() * this.props.autoSelectCutOffMultiplier;
  private rightOuterActionAutoSelectSwipeValue = () => this.rightOpenValue() * this.props.autoSelectCutOffMultiplier;

  private panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => false,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const absDx = Math.abs(gestureState.dx);
      const absDy = Math.abs(gestureState.dy);

      return absDx > this.props.minRegisteredSwipeDistance || absDx > absDy;
    },
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

    onPanResponderGrant: (evt, gestureState) => {
      const { translateX } = this.state;
      const { onSwipeBegin, interactionKey } = this.props;

      translateX.setOffset(this.xPosition);
      translateX.setValue(0);
      onSwipeBegin?.(interactionKey);
    },
    onPanResponderMove: (evt, gestureState) => {
      const { translateX } = this.state;
      const { disableRightSwipe, disableLeftSwipe } = this.props;
      const { dx } = gestureState;

      // Swipe direction is disabled or there is nothing to show:
      if (dx > 0 && (disableRightSwipe || this.leftActionWidthsTotal() === 0)) return;
      if (dx < 0 && (disableLeftSwipe || this.rightActionWidthsTotal() === 0)) return;

      const slowDownMultiplier = 0.125;

      // Swiped past the slow down value from closed position:
      if (dx > this.slowDownRightSwipeAfter() && !this.areLeftActionsOpen) {
        translateX.setValue(this.slowDownRightSwipeAfter() + (dx - this.slowDownRightSwipeAfter()) * slowDownMultiplier);
        return;
      }

      if (dx < this.slowDownLeftSwipeAfter() && !this.areRightActionsOpen) {
        translateX.setValue(this.slowDownLeftSwipeAfter() + (dx - this.slowDownLeftSwipeAfter()) * slowDownMultiplier);
        return;
      }

      // Swiped past the slow down value from open position:
      let distBetweenOpenValueAndSlowDownValue = this.slowDownRightSwipeAfter() - this.leftOpenValue();
      if (this.areLeftActionsOpen && dx > distBetweenOpenValueAndSlowDownValue) {
        translateX.setValue(distBetweenOpenValueAndSlowDownValue + dx * slowDownMultiplier);
        return;
      }

      distBetweenOpenValueAndSlowDownValue = this.slowDownLeftSwipeAfter() - this.rightOpenValue();
      if (this.areRightActionsOpen && dx < distBetweenOpenValueAndSlowDownValue) {
        translateX.setValue(distBetweenOpenValueAndSlowDownValue + dx * slowDownMultiplier);
        return;
      }

      // Swiped less than the slow down value:
      translateX.setValue(dx);
    },
    onPanResponderTerminationRequest: (evt, gestureState) => {
      this.close(gestureState.vx);

      return true;
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { translateX } = this.state;
      const { onSwipeEnd, interactionKey, openCutoffMultiplier, minVelocityToOpen } = this.props;

      onSwipeEnd?.(interactionKey);

      translateX.flattenOffset();

      const { vx } = gestureState;
      const bothSidesAreClosed = !this.areLeftActionsOpen && !this.areRightActionsOpen;
      const itemIsPastLeftOpenCutoff = this.xPosition >= this.leftOpenValue() * openCutoffMultiplier;
      const itemIsPastRightOpenCutoff = this.xPosition <= this.rightOpenValue() * openCutoffMultiplier;
      const swipedRightQuickly = vx > minVelocityToOpen;
      const swipedLeftQuickly = vx < -minVelocityToOpen;

      if (bothSidesAreClosed && (itemIsPastLeftOpenCutoff || swipedRightQuickly)) {
        this.openLeftActions(vx);
      } else if (this.areLeftActionsOpen && itemIsPastLeftOpenCutoff && !swipedLeftQuickly) {
        this.openLeftActions(vx);
      } else if (bothSidesAreClosed && (itemIsPastRightOpenCutoff || swipedLeftQuickly)) {
        this.openRightActions(vx);
      } else if (this.areRightActionsOpen && itemIsPastRightOpenCutoff && !swipedRightQuickly) {
        this.openRightActions(vx);
      } else {
        this.close(vx);
      }

      const leftOuterAction = this.leftOuterAction();
      if (this.isLeftOuterActionAutoSelected && leftOuterAction != null) {
        this.handleInteraction(leftOuterAction.onInteraction);
      }

      const rightOuterAction = this.rightOuterAction();
      if (this.isRightOuterActionAutoSelected && rightOuterAction != null) {
        this.handleInteraction(rightOuterAction.onInteraction);
      }
    },
    onPanResponderTerminate: (evt, gestureState) => this.props.onSwipeEnd?.(this.props.interactionKey),
  });

  private handleInteraction = (callback?: InteractionCallback) => {
    this.close();
    callback?.(this.props.interactionKey);
  };

  private handlePress = () => {
    const { onPress, interactionKey } = this.props;

    onPress?.(interactionKey);
  };

  private autoSelectAnimationConfiguration = (toValue: number) => ({
    toValue,
    overshootClamping: true,
    friction: 100,
    tension: 100,
  });

  private openCloseAnimationsConfiguration = (toValue: number, velocity: number) => ({
    toValue,
    overshootClamping: true,
    velocity,
    friction: 100,
    tension: 100,
  });

  private autoSelectOrDeselectOuterAction(swipeValue: number): void {
    if (swipeValue > 0 && !this.props.autoSelectLeftOuterAction) return;
    if (swipeValue < 0 && !this.props.autoSelectRightOuterAction) return;

    if (swipeValue >= this.leftOuterActionAutoSelectSwipeValue() && !this.isLeftOuterActionAutoSelected) {
      this.isLeftOuterActionAutoSelected = true;
      this.giveHapticFeedback();
      this.runAutoSelectOuterActionAnimation('left');
    }

    if (swipeValue < this.leftOuterActionAutoSelectSwipeValue() && this.isLeftOuterActionAutoSelected) {
      this.isLeftOuterActionAutoSelected = false;
      this.giveHapticFeedback();
      this.runAutoDeselectOuterActionAnimation('left');
    }

    if (swipeValue <= this.rightOuterActionAutoSelectSwipeValue() && !this.isRightOuterActionAutoSelected) {
      this.isRightOuterActionAutoSelected = true;
      this.giveHapticFeedback();
      this.runAutoSelectOuterActionAnimation('right');
    }

    if (swipeValue > this.rightOuterActionAutoSelectSwipeValue() && this.isRightOuterActionAutoSelected) {
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
    const numOfActions = location === 'left' ? this.numOfLeftActions() : this.numOfRightActions();

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
      this.openCloseAnimationsConfiguration(x, velocity),
    ).start(() => {
      const { interactionKey, onLeftActionsDidOpen, onRightActionsDidOpen } = this.props;

      if (x >= this.leftOpenValue()) {
        if (!this.areLeftActionsOpen) {
          onLeftActionsDidOpen?.(interactionKey);
        }

        this.areLeftActionsOpen = true;
      } else if (x <= this.rightOpenValue()) {
        if (!this.areRightActionsOpen) {
          onRightActionsDidOpen?.(interactionKey);
        }

        this.areRightActionsOpen = true;
      }
    });
  }

  private renderAction(action: SwipeableItemAction, location: Location): JSX.Element {
    const { title, icon, color, titleStyle: actionSpecificTitleStyle, onInteraction } = action;
    const { titleStyle: commonTitleStyle } = this.props;

    let style: any[];

    const commonStyle = {
      backgroundColor: color,
      alignItems: location === 'left' ? 'flex-end' : 'flex-start',
    };

    if (action === this.leftOuterAction() || action === this.rightOuterAction()) {
      const widthPercent = location === 'left' ? this.state.leftOuterActionWidthPercent : this.state.rightOuterActionWidthPercent;

      style = [styles.action, commonStyle, {
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
      style = [styles.action, commonStyle, {
        flex: 1,
      }];
    }

    const contentStyle = [styles.actionContent, {
      width: this.props.actionWidth,
    }];

    return (
      <TouchableWithoutFeedback onPress={() => this.handleInteraction(onInteraction)}>
        <Animated.View style={style}>
          <View style={contentStyle}>
            {icon && (<Image source={icon} />)}
            {title && (<Text style={[styles.actionTitle, commonTitleStyle, actionSpecificTitleStyle]}>{title}</Text>)}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  private renderActions(location: Location): JSX.Element {
    const actions = location === 'left' ? this.props.actionsLeft : this.props.actionsRight;

    return <Animated.View style={[styles.actionsContainer, {
      right: location === 'right' ? 0 : undefined,
      left: location === 'left' ? 0 : undefined,
      width: this.state.translateX.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: location === 'left' ? [0, 0, 1] : [1, 0, 0],
      }),
    }]}>
      {actions?.map(action => this.renderAction(action, location))}
      {/* The outer action is always positioned absolutely, so we can
      change its width when it is auto selected. For this reason, this
      filler action fills up the space it would take if it were not
      positioned absolutely, so that all actions are properly positioned. */}
      <Animated.View style={styles.fillerAction} />
    </Animated.View>;
  }

  state = {
    translateX: new Animated.Value(0),
    leftOuterActionWidthPercent: new Animated.Value(this.outerActionWidthPercentWhenNotAutoSelected('left')),
    rightOuterActionWidthPercent: new Animated.Value(this.outerActionWidthPercentWhenNotAutoSelected('right')),
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
    if (this.xPosition === 0) return;

    const { interactionKey, onActionsWillClose, onActionsDidClose } = this.props;

    if (this.areRightActionsOpen || this.areLeftActionsOpen) {
      onActionsWillClose?.(interactionKey);
    }

    this.isClosing = true;

    Animated.spring(
      this.state.translateX,
      this.openCloseAnimationsConfiguration(0, velocity),
    ).start(() => {
      if (this.areRightActionsOpen || this.areLeftActionsOpen) {
        onActionsDidClose?.(interactionKey);
      }

      this.isClosing = false;
      this.areLeftActionsOpen = false;
      this.areRightActionsOpen = false;
    });
  }

  openLeftActions(velocity = 0): void {
    const { interactionKey, onLeftActionsWillOpen } = this.props;

    if (!this.areLeftActionsOpen) {
      onLeftActionsWillOpen?.(interactionKey);
    }

    this.openTo(this.leftOpenValue(), velocity);
  }

  openRightActions(velocity = 0): void {
    const { interactionKey, onRightActionsWillOpen } = this.props;

    if (!this.areRightActionsOpen) {
      onRightActionsWillOpen?.(interactionKey);
    }

    this.openTo(this.rightOpenValue(), velocity);
  }

  render() {
    const { translateX } = this.state;
    const { children } = this.props;

    const transformStyle = {
      transform: [{ translateX }],
    };

    return (
      <View {...this.panResponder.panHandlers}>
        <TouchableWithoutFeedback onPress={this.handlePress}>
          <View style={styles.container}>
            {this.numOfLeftActions() > 0 && this.renderActions('left')}
            <Animated.View style={[styles.itemContainer, transformStyle]}>
              {children}
            </Animated.View>
            {this.numOfRightActions() > 0 && this.renderActions('right')}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  itemContainer: {
    width: '100%',
  },
  actionsContainer: {
    flexDirection: 'row',
    height: '100%',
    position: 'absolute',
  },
  action: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  actionContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    textAlign: 'center',
  },
  fillerAction: {
    height: '100%',
    flex: 1,
    zIndex: -1,
  },
});
