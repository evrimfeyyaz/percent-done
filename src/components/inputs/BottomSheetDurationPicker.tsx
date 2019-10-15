import React, { Component, createRef } from 'react';
import { BottomSheet, DurationPicker } from '..';
import _ from 'lodash';

interface BottomSheetDurationPickerProps {
  initialDuration: { hours: number, minutes: number };
  onDurationChange?: (hours: number, minutes: number) => void;
}

interface BottomSheetDurationPickerState {
  duration: { hours: number, minutes: number };
}

export class BottomSheetDurationPicker extends Component<BottomSheetDurationPickerProps, BottomSheetDurationPickerState> {
  private readonly bottomSheetRef: React.RefObject<BottomSheet>;

  constructor(props: BottomSheetDurationPickerProps) {
    super(props);

    this.state = {
      duration: _.clone(props.initialDuration),
    };
    this.bottomSheetRef = createRef<BottomSheet>();
  }

  show() {
    this.setState({ duration: _.clone(this.props.initialDuration) });
    this.bottomSheetRef?.current?.open();
  };

  hide() {
    this.bottomSheetRef?.current?.close();
  };

  handleDurationChange = (hours: number, minutes: number) => {
    this.setState({ duration: { hours, minutes } });
  };

  handleCancelPress = () => {
    this.setState({ duration: _.clone(this.props.initialDuration) }, () => {
      this.hide();
    });
  };

  handleDonePress = () => {
    this.hide();
  };

  handleClose = () => {
    const { initialDuration, onDurationChange } = this.props;
    const { duration } = this.state;

    if ((initialDuration.hours !== duration.hours || initialDuration.minutes !== duration.minutes)) {
      onDurationChange?.(duration.hours, duration.minutes);
    }
  };

  render() {
    const { initialDuration } = this.props;

    return (
      <BottomSheet ref={this.bottomSheetRef} onCancelPress={this.handleCancelPress} onDonePress={this.handleDonePress}
                   onClose={this.handleClose}>
        <DurationPicker initialDuration={initialDuration} onDurationChange={this.handleDurationChange} />
      </BottomSheet>
    );
  }
};
