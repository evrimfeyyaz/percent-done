import React, { Component, ComponentType, createRef } from 'react';
import { BottomSheet } from '..';
import _ from 'lodash';

interface WithBottomSheetProps<T> {
  initialValue: T;
  allValues?: T[];
  onValueChange?: (value: T) => void;
}

interface WithBottomSheetState<T> {
  value: T;
}

export function withBottomSheet<T>(WrappedComponent: ComponentType<WithBottomSheetProps<T>>) {
  return class WithBottomSheet extends Component<WithBottomSheetProps<T>, WithBottomSheetState<T>> {
    private readonly bottomSheetRef: React.RefObject<BottomSheet>;

    constructor(props: WithBottomSheetProps<T>) {
      super(props);

      this.state = {
        value: _.clone(props.initialValue),
      };
      this.bottomSheetRef = createRef<BottomSheet>();
    }

    show() {
      this.setState({ value: _.clone(this.props.initialValue) });
      this.bottomSheetRef?.current?.open();
    };

    hide() {
      this.bottomSheetRef.current?.close();
    };

    handleValueChange = (value: T) => {
      this.setState({ value });
    };

    handleCancelPress = () => {
      this.setState({ value: _.clone(this.props.initialValue) }, () => {
        this.hide();
      });
    };

    handleDonePress = () => {
      this.hide();
    };

    handleClose = () => {
      const { initialValue, onValueChange } = this.props;
      const { value } = this.state;

      if (!_.isEqual(value, initialValue)) {
        onValueChange?.(value);
      }
    };

    render() {
      const { onValueChange, ...rest } = this.props;

      return (
        <BottomSheet ref={this.bottomSheetRef} onCancelPress={this.handleCancelPress} onDonePress={this.handleDonePress}
                     onClose={this.handleClose}>
          <WrappedComponent onValueChange={this.handleValueChange} {...rest} />
        </BottomSheet>
      );
    }
  }
}
