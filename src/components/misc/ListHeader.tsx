import React, { FunctionComponent } from 'react';
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import { Button } from '..';
import { textStyles } from '../../theme';

interface ListHeaderProps {
  description?: string;
  buttonTitle?: string;
  buttonIconSource?: any;
  onButtonPress?: (event: GestureResponderEvent) => void;
}

export const ListHeader: FunctionComponent<ListHeaderProps> = ({
                                                                 description, onButtonPress,
                                                                 buttonTitle, buttonIconSource,
                                                               }) => {
  return (
    <View style={styles.container}>
      {buttonTitle && (
        <Button title={buttonTitle} style={styles.addGoalButton} iconSource={buttonIconSource}
                onPress={onButtonPress} />
      )}
      {description && (
        <Text style={[styles.goalsDescription, textStyles.body]}>
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsDescription: {
    textAlign: 'center',
    marginHorizontal: 40,
  },
  addGoalButton: {
    width: 200,
    marginBottom: 20,
  },
});
