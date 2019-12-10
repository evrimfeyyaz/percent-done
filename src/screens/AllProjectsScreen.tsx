import React from 'react';
import { BackgroundView } from '../components';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { StyleSheet, Text } from 'react-native';

export const AllProjectsScreen: NavigationStackScreenComponent = ({ navigation }) => {
  return (
    <BackgroundView style={styles.container}>
      <Text>All Projects</Text>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
});
