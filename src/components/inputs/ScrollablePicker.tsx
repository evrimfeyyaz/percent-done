import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text, TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../theme';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ITEM_SIZE = 40;

interface ScrollablePickerProps {
  index: number;
  data: {
    key: string,
    value: string,
  }[];
  /**
   * Text to show after the picker to denote its purpose.
   */
  text?: string;
  /**
   * Alignment of items inside the picker.
   */
  alignment?: 'start' | 'center' | 'end';
  onIndexChange?: (index: number) => void;
  style?: ViewStyle;
}

export const ScrollablePicker: FunctionComponent<ScrollablePickerProps> = ({ index, data, text, alignment = 'end', onIndexChange, style }) => {
  const [tempIndex, setTempIndex] = useState(index);

  const scrollViewRef = useRef<ScrollView>(null);

  const getScrollLocationByIndex = (index: number) => index * ITEM_SIZE;

  useEffect(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
  }, [tempIndex]);

  const handleLayout = () => {
    if (scrollViewRef != null && scrollViewRef.current != null) {
      const location = getScrollLocationByIndex(index);

      scrollViewRef.current.scrollTo({ y: location, animated: true });
    }
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = event.nativeEvent.contentOffset.y / ITEM_SIZE;

    if (onIndexChange != null) onIndexChange(index);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const errorMargin = 10;

    if (event.nativeEvent.contentOffset.y % ITEM_SIZE < errorMargin) {
      const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_SIZE);
      if (index !== tempIndex) setTempIndex(index);
    }
  };

  let itemAlignmentStyle: TextStyle;
  if (alignment === 'start') {
    itemAlignmentStyle = { alignItems: 'flex-start' };
  } else if (alignment === 'end') {
    itemAlignmentStyle = { alignItems: 'flex-end' };
  } else {
    itemAlignmentStyle = { alignItems: 'center' };
  }

  const item = (itemData: { key: string, value: string }) => (
    <View style={StyleSheet.flatten([styles.itemContainer, itemAlignmentStyle])} key={itemData.key}>
      <Text style={styles.item}>{itemData.value}</Text>
    </View>
  );

  const items = data.map(itemData => item(itemData));

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <MaskedView
        style={styles.mask}
        maskElement={
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.05, 0.4, 0.5, 0.6, 0.95, 1]}
            colors={['transparent', 'transparent', '#ffffff80', '#fff', '#ffffff80', 'transparent', 'transparent']}
            style={styles.maskGradient}
          />
        }>
        <ScrollView
          centerContent={true}
          contentOffset={{ x: 0, y: getScrollLocationByIndex(index) }}
          snapToAlignment='center'
          snapToInterval={ITEM_SIZE}
          decelerationRate='fast'
          overScrollMode='always'
          contentContainerStyle={{ paddingVertical: ITEM_SIZE * 2 }}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onLayout={handleLayout}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {items}
        </ScrollView>
      </MaskedView>
      {text != null && (
        // @ts-ignore
        <Text style={styles.text} pointerEvents='none'>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    height: ITEM_SIZE,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  item: {
    fontFamily: fonts.regular,
    fontSize: 24,
  },
  scrollView: {
    height: ITEM_SIZE * 5,
    minWidth: 45,
  },
  mask: {
    height: ITEM_SIZE * 5,
  },
  maskGradient: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 24,
    color: colors.gray,
  },
});
