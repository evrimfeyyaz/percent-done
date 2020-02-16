import React, { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import { textStyles } from '../../theme';
import { deconstructFormattedDuration, formatDurationInMs } from '../../utilities';

interface DurationInfoProps {
  durationInMs: number;
  /**
   * The text to show after the information, such as "completed" or "left."
   */
  tailText?: string;
  /**
   * Whether or not the last value of the duration, i.e. minutes or seconds,
   * should be rounded up to the nearest integer.
   *
   * Default is `false`.
   */
  roundLastValueUp?: boolean;
}

export const DurationInfo: FunctionComponent<DurationInfoProps> = ({ durationInMs, roundLastValueUp = false, tailText }) => {
  const {
    firstPart,
    firstDenotation,
    secondPart,
    secondDenotation,
  } = deconstructFormattedDuration(formatDurationInMs(durationInMs, roundLastValueUp));

  return (
    <View>
      <Text style={textStyles.info}>
        {firstPart}
        <Text style={textStyles.infoLabel}>{firstDenotation.toUpperCase()}</Text>
        &nbsp;{secondPart}
        <Text style={textStyles.infoLabel}>{secondDenotation.toUpperCase()}</Text>
        {tailText && <Text style={textStyles.infoTail}> {tailText}</Text>}
      </Text>
    </View>
  );
};
