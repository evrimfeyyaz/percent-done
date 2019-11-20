import React from 'react';
import { DurationPicker } from '..';
import { withBottomSheet } from './withBottomSheet';

export const BottomSheetDurationPicker = withBottomSheet<{ hours: number, minutes: number }>(DurationPicker);
