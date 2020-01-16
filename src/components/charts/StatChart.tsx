import React, { FunctionComponent } from 'react';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Image, StyleSheet, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Circle, Defs, Line, LinearGradient, Stop } from 'react-native-svg';
import { Images } from '../../../assets';

export type StatChartData = {
  label: string;
  value: number | null;
}[];

interface StatChartProps {
  data: StatChartData;
  min: number;
  max: number;
  median: number;
}

export const StatChart: FunctionComponent<StatChartProps> = ({
                                                               data,
                                                               min,
                                                               max,
                                                               median,
                                                             }) => {
  const contentInset = { top: 20, bottom: 20, left: 30, right: 30 };

  const StrokeGradient = () => (
    <Defs key={'strokeGradient'}>
      <LinearGradient
        id={'strokeGradient'}
        x1={'0'}
        y1={'0%'}
        x2={'0%'}
        y2={'100%'}
      >
        <Stop offset={'0%'} stopColor={colors.orange} />
        <Stop offset={'100%'} stopColor={colors.yellow} />
      </LinearGradient>
    </Defs>
  );

  const Points: any = ({ x, y, data }: { x: Function, y: Function, data: StatChartData }) => {
    return data.map(({ value }, index) => {
      if (value == null) return null;

      return (
        <Circle
          key={index}
          cx={x(index)}
          cy={y(value)}
          r={4}
          fill={colors.orange}
        />
      );
    });
  };

  const MedianLine: any = ({ x, y }: { x: Function; y: Function }) => {
    const lastElementIndex = data.length - 1;

    return (
      <Line
        key={'medianLine'}
        x1={x(0)}
        x2={x(lastElementIndex)}
        y={y(median)}
        stroke={colors.white}
        strokeDasharray={[4, 8]}
        strokeWidth={2}
        strokeOpacity={0.4}
      />
    );
  };

  return (
    <View style={styles.container}>
      <YAxis
        style={styles.yAxis}
        data={data}
        contentInset={contentInset}
        svg={{
          fill: colors.white,
          fillOpacity: 0.2,
          fontSize: 12,
          fontFamily: fonts.regular,
          textAnchor: 'end',
        }}
        numberOfTicks={5}
        min={min}
        max={max}
      />
      <View style={styles.content}>
        <LineChart
          style={styles.chart}
          data={data}
          yAccessor={({ item }) => item.value ?? 0}
          yMin={min}
          yMax={max}
          contentInset={contentInset}
          svg={{
            strokeWidth: 2,
            stroke: data.length > 7 ? 'url(#strokeGradient)' : undefined,
          }}
        >
          <Image source={Images.chartBg} style={styles.chartBg} />
          <Grid
            svg={{ stroke: colors.white, strokeOpacity: 0.04, strokeWidth: 1 }}
          />
          {data.length > 7 && (
            <StrokeGradient />
          )}
          {data.length <= 7 && (
            <Points />
          )}
          <MedianLine />
        </LineChart>
        <XAxis
          data={data}
          formatLabel={value => data[value].label.toLocaleUpperCase()}
          contentInset={contentInset}
          numberOfTicks={4}
          svg={{
            fill: colors.white,
            fillOpacity: 0.2,
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
  content: {
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
