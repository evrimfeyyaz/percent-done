import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { ProgressChart, Section } from '../components';
import { TodaysIncompleteGoalsList } from '../containers';
import { textStyles } from '../theme';

export const GoalsScreen: NavigationScreenComponent = () => {
  return (
    <ScrollView>
      <Section title="Today's Stats">
        <View style={styles.container}>
          <ProgressChart percentDone={75} />
          <View style={styles.infoContainer}>
            <View>
              <Text style={textStyles.info}>
                1<Text style={textStyles.infoSmall}>H</Text> 30
                <Text style={textStyles.infoSmall}>M</Text>
                <Text style={textStyles.infoTail}> done</Text>
              </Text>
            </View>
            <View>
              <Text style={textStyles.info}>
                1<Text style={textStyles.infoSmall}>H</Text> 30
                <Text style={textStyles.infoSmall}>M</Text>
                <Text style={textStyles.infoTail}> left</Text>
              </Text>
            </View>
          </View>
        </View>
      </Section>

      <Section title='Incomplete Goals'>
        <TodaysIncompleteGoalsList />
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginStart: 20,
  },
});
