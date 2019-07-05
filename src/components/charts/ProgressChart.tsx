import React, { FunctionComponent } from 'react'
import { ProgressCircle } from 'react-native-svg-charts'
import { StyleSheet, View, Text } from 'react-native';

interface ProgressChartProps {
  percentDone: number,
}

export const ProgressChart: FunctionComponent<ProgressChartProps> = ({ percentDone = 0 }) => {
  return (
    <View>
      <ProgressCircle style={{ height: 125, width: 125 }}
                      progress={percentDone / 100}
                      backgroundColor={'#464855'}
                      progressColor={'#EAB400'}
                      strokeWidth={15}
                      endAngle={-Math.PI * 2} />
      <View style={styles.infoContainer}>
        <Text style={styles.percentDone}>
          {percentDone}
          <Text style={styles.percentSign}>
            %
          </Text>
        </Text>
        <Text style={styles.done}>
          Done
        </Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  infoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentDone: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 36,
    color: '#fff',
  },
  percentSign: {
    fontSize: 12,
  },
  done: {
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 12,
    color: '#9B9B9B',
    textTransform: 'uppercase',
    marginTop: -5,
  }
});