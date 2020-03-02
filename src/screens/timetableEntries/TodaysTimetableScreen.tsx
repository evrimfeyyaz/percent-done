import React, { useEffect } from 'react';
import { NavigationMaterialTabScreenComponent } from 'react-navigation-tabs';
import { TodaysTimetable } from '../../containers';
import { Alert, LayoutAnimation, ScrollView, StyleSheet } from 'react-native';
import { Icons } from '../../../assets';
import { ListHeader } from '../../components';
import { useDispatchCurrentDateOnRender } from '../../utilities';
import { useSelector } from 'react-redux';
import { getAllGoals } from '../../store/goals/selectors';
import { StoreState } from '../../store/types';

export const TodaysTimetableScreen: NavigationMaterialTabScreenComponent = ({ navigation }) => {
  useDispatchCurrentDateOnRender();

  const allGoals = useSelector((state: StoreState) => getAllGoals(state));

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, []);

  const handleAddButtonPress = () => {
    if (allGoals.length > 0) {
      navigation.navigate('AddTimetableEntry');
    } else {
      Alert.alert('You need to add a goal first.');
    }
  };

  const handleEntryPress = (timetableEntryId: string) => {
    navigation.navigate('EditTimetableEntry', { timetableEntryId });
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} alwaysBounceVertical={false}>
      <ListHeader
        buttonTitle='Add Entry'
        buttonIconSource={Icons.addEntry}
        onButtonPress={handleAddButtonPress}
      />
      <TodaysTimetable onEntryPress={handleEntryPress} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
    alignItems: 'center',
    flexGrow: .5,
  },
  addEntryButton: {
    width: 200,
    marginBottom: 20,
  },
});
