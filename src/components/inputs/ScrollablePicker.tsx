import React, { FunctionComponent, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../theme';

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
  onIndexChange?: (index: number) => void;
}

export const ScrollablePicker: FunctionComponent<ScrollablePickerProps> = ({ index, data, text, onIndexChange }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const getScrollLocationByIndex = (index: number) => index * ITEM_SIZE;

  const handleScrollViewLayout = () => {
    if (scrollViewRef != null && scrollViewRef.current != null) {
      const location = getScrollLocationByIndex(index);

      scrollViewRef.current.scrollTo({ y: location, animated: true });
    }
  };

  const handleScrollViewMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = event.nativeEvent.contentOffset.y / ITEM_SIZE;

    if (onIndexChange != null) onIndexChange(index);
  };

  const item = (itemData: { key: string, value: string }) => (
    <View style={styles.itemContainer} key={itemData.key}>
      <Text style={styles.item}>{itemData.value}</Text>
    </View>
  );

  const items = data.map(itemData => item(itemData));

  return (
    <View style={styles.container}>
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
          onLayout={handleScrollViewLayout}
          onMomentumScrollEnd={handleScrollViewMomentumScrollEnd}
        >
          {items}
        </ScrollView>
      </MaskedView>
      {text != null && (
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
    backgroundColor: colors.white,
    width: 200,
    height: ITEM_SIZE * 5,
    borderRadius: 10,
  },
  itemContainer: {
    height: ITEM_SIZE,
    alignItems: 'flex-end',
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
    color: colors.orange,
  },
});
