import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  BackgroundView,
  TimetableEntryForm,
  HeaderButton,
  HeaderCancelButton,
} from '../../components';
import { EditTimetableEntryForm } from '../../containers';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

export const EditTimetableEntryScreen: NavigationStackScreenComponent = ({ navigation }) => {
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
      {/*
      // @ts-ignore */}
      <EditTimetableEntryForm ref={formRef} timetableEntryId={navigation.getParam('timetableEntryId')}
                              onDelete={() => navigation.goBack(null)} />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
});

EditTimetableEntryScreen.navigationOptions = ({ navigation }) => ({
  title: 'Edit Entry',
  headerLeft: () => <HeaderCancelButton onPress={() => navigation.dismiss()} />,
  headerRight: () => <HeaderButton title='Save' onPress={navigation.getParam('headerRightOnPress')} primary />,
});
