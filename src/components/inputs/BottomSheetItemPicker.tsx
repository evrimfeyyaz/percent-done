import React from 'react';
import { ItemPicker } from '..';
import { withBottomSheet } from './withBottomSheet';

export const BottomSheetItemPicker = withBottomSheet<{ key: string, value: string }>(ItemPicker);
