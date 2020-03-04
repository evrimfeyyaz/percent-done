import React, { FunctionComponent } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { textStyles } from '../../theme';

interface TextOnlyPageProps {
  text: string;
}

export const TextOnlyPage: FunctionComponent<TextOnlyPageProps> = ({ text }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={[textStyles.body, styles.text]}>
        {text}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text: {
    marginBottom: 20,
  },
});
