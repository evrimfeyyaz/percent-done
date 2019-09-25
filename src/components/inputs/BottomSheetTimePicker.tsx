import React, { Component, createRef } from 'react';
import { TimePicker, BottomSheet } from '..';

interface BottomSheetTimePickerProps {
  initialTime: Date;
  onTimeChange?: (time: Date) => void;
}

interface BottomSheetTimePickerState {
  time: Date;
}

export class BottomSheetTimePicker extends Component<BottomSheetTimePickerProps, BottomSheetTimePickerState> {
  private readonly bottomSheetRef: React.RefObject<BottomSheet>;

  constructor(props: BottomSheetTimePickerProps) {
    super(props);

    this.state = {
      time: new Date(props.initialTime.getTime()),
    };
    this.bottomSheetRef = createRef<BottomSheet>();
  }

  show() {
    this.setState({ time: new Date(this.props.initialTime.getTime()) });
    if (this.bottomSheetRef != null && this.bottomSheetRef.current != null) {
      this.bottomSheetRef.current.open();
    }
  };

  hide() {
    if (this.bottomSheetRef != null && this.bottomSheetRef.current != null) {
      this.bottomSheetRef.current.close();
    }
  };

  handleTimeChange = (time: Date) => {
    this.setState({ time });
  };

  handleCancelPress = () => {
    this.setState({ time: new Date(this.props.initialTime.getTime()) }, () => {
      this.hide();
    });
  };

  handleDonePress = () => {
    this.hide();
  };

  handleClose = () => {
    const { initialTime, onTimeChange } = this.props;
    const { time } = this.state;

    if (initialTime.getTime() !== time.getTime() && onTimeChange != null) {
      onTimeChange(time);
    }
  };

  render() {
    const { initialTime } = this.props;

    return (
      <BottomSheet ref={this.bottomSheetRef} onCancelPress={this.handleCancelPress} onDonePress={this.handleDonePress}
                   onClose={this.handleClose}>
        <TimePicker initialTime={initialTime} onTimeChange={this.handleTimeChange} />
      </BottomSheet>
    );
  }
}
