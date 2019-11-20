import React from 'react';
import { DatePicker } from '..';
import { withBottomSheet } from './withBottomSheet';

export const BottomSheetDatePicker = withBottomSheet<Date>(DatePicker);
