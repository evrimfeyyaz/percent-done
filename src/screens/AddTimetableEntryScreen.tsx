import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  BackgroundView,
  TimetableEntryForm,
  HeaderButton,
  HeaderCancelButton,
} from '../components';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { AddTimetableEntryForm } from '../containers';

export const AddTimetableEntryScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const formRef = useRef<TimetableEntryForm>(null);

  const submitFormAndClose = () => {
    if (formRef?.current?.submit()) {
      navigation.goBack(null);
    }
  };

  useEffect(() => {
    navigation.setParams({
      headerRightOnPress: submitFormAndClose,
    });
  }, []);

  return (
    <BackgroundView style={styles.container}>
      <AddTimetableEntryForm
        // @ts-ignore
        ref={formRef}
      />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
});

AddTimetableEntryScreen.navigationOptions = ({ navigation }) => ({
  title: 'Add Entry',
  headerLeft: () => <HeaderCancelButton onPress={() => navigation.dismiss()} />,
  headerRight: () => <HeaderButton title='Save' onPress={navigation.getParam('headerRightOnPress')} primary />,
});
