import React, { FunctionComponent } from 'react';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Image, StyleSheet, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Defs, Line, LinearGradient, Stop } from 'react-native-svg';
import { Images } from '../../../assets';
import { shortDayName, median } from '../../utilities';

interface PercentDoneChartProps {
  /**
   * Data to plot. Should be ordered by date in ascending order.
   */
  data: {
    date: Date,
    percentDone: number,
  }[],
}

export const PercentDoneChart: FunctionComponent<PercentDoneChartProps> = ({ data }) => {
  const contentInset = { top: 20, bottom: 20, left: 30, right: 30 };

  const StrokeGradient = () => (
    <Defs key={'strokeGradient'}>
      <LinearGradient id={'strokeGradient'} x1={'0'} y1={'0%'} x2={'0%'} y2={'100%'}>
        <Stop offset={'0%'} stopColor={colors.orange} />
        <Stop offset={'100%'} stopColor={colors.yellow} />
      </LinearGradient>
    </Defs>
  );

  const MedianLine: any = (({ y }: { y: Function }) => {
    const medianPercentage = median(data.map(dailyPercentDone => dailyPercentDone.percentDone));

    return (
      <Line
        key={'medianLine'}
        x1={'0%'}
        x2={'100%'}
        y1={y(medianPercentage)}
        y2={y(medianPercentage)}
        stroke={colors.orange}
        strokeDasharray={[4, 8]}
        strokeWidth={2}
        strokeOpacity={.4}
      />
    );
  });

  return (
    <View style={styles.container}>
      <YAxis
        style={styles.yAxis}
        data={data}
        contentInset={contentInset}
        svg={{
          fill: colors.white,
          fillOpacity: .2,
          fontSize: 12,
          fontFamily: fonts.regular,
          textAnchor: 'end',
        }}
        numberOfTicks={6}
        min={0}
        max={100}
      />
      <View style={styles.innerContainer}>
        <LineChart
          style={styles.chart}
          data={data}
          numberOfTicks={6}
          yAccessor={({ item }) => item.percentDone}
          yMin={0}
          yMax={100}
          contentInset={contentInset}
          svg={{
            strokeWidth: 2,
            stroke: 'url(#strokeGradient)',
          }}
        >
          <Image source={Images.chartBg} style={styles.chartBg} />
          <Grid svg={{ stroke: colors.white, strokeOpacity: .04, strokeWidth: 1 }} />
          <StrokeGradient />
          <MedianLine />
        </LineChart>
        <XAxis
          data={data}
          formatLabel={value => shortDayName(data[value].date)}
          contentInset={contentInset}
          numberOfTicks={4}
          svg={{
            fill: colors.white,
            fillOpacity: .2,
            fontSize: 12,
            fontFamily: fonts.regular,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  yAxis: {
    height: 200,
    width: 40,
    marginEnd: -12,
  },
  innerContainer: {
    flex: 1,
  },
  chart: {
    flex: 1,
    height: 200,
  },
  chartBg: {
    transform: [{ scale: 1.5 }],
  },
});