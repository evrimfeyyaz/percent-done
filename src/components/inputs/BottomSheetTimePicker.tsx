import React from 'react';
import { TimePicker } from '..';
import { withBottomSheet } from './withBottomSheet';

export const BottomSheetTimePicker = withBottomSheet<Date>(TimePicker);
