import React from 'react';
import OnboardingSwiper, { Page } from 'react-native-onboarding-swiper';
import { FunctionComponent } from 'react';
import { colors, fonts } from '../../theme';
import { Icons, Images } from '../../../assets';
import { Image, StyleSheet, View, Text, Platform } from 'react-native';
import { Button } from '..';
import { isScreenSmall } from '../../utilities/isScreenSmall';
import { PushNotificationPermissions } from 'react-native-push-notification';

interface OnboardingProps {
  notificationPermissions: PushNotificationPermissions;
  onSkip?: () => void;
  onDone?: () => void;
  onAddGoalPress?: () => void;
  onTurnOnNotificationsPress?: () => void;
}

export const Onboarding: FunctionComponent<OnboardingProps> = ({
                                                                 notificationPermissions, onSkip, onDone,
                                                                 onAddGoalPress, onTurnOnNotificationsPress,
                                                               }) => {
  function areNotificationsOn(): boolean {
    return !!notificationPermissions.alert;
  }

  // @ts-ignore
  const welcome: Page = {
    backgroundColor: colors.lightGray,
    image: (
      <View style={styles.imageCard}>
        <Image source={Images.logo} style={[styles.image, styles.logo]} />
      </View>
    ),
    subtitle: (
      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          Welcome!
        </Text>
        <Text style={styles.subtitle}>
          Percent Done helps you to set goals and track them every day. Let's take a quick tour to see how it can help
          you.
        </Text>
      </View>
    ),
  };

  // @ts-ignore
  const goals: Page = {
    backgroundColor: colors.lightGray,
    image: (
      <View style={styles.imageCard}>
        <Image source={Images.onboarding.goals} style={styles.image} />
      </View>
    ),
    subtitle: (
      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          Goals
        </Text>
        <Text style={styles.subtitle}>
          Goals are tasks or habits that you would like to track day by day, such as "writing for an hour every day" or
          "exercising Monday to Friday."
        </Text>

        <Button title='Add a Goal' style={styles.callToAction} onPress={onAddGoalPress} />
      </View>
    ),
  };

  // @ts-ignore
  const swipeToTrack: Page = {
    backgroundColor: colors.lightGray,
    image: (
      <View style={styles.imageCard}>
        <Image source={Images.onboarding.swipeToTrack} style={styles.image} />
      </View>
    ),
    subtitle: (
      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          Track or Complete
        </Text>
        <Text style={styles.subtitle}>
          After adding a goal, you can swipe right on it to start tracking it, or set it as complete if it is not a
          time-tracked goal.
        </Text>
      </View>
    ),
  };

  // @ts-ignore
  const streak: Page = {
    backgroundColor: colors.lightGray,
    image: (
      <View style={styles.imageCard}>
        <Image source={Images.onboarding.streak} style={styles.image} />
      </View>
    ),
    subtitle: (
      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          Don't Break the Chain
        </Text>
        <Text style={styles.subtitle}>
          As you complete your goals every day, you will build up a streak.
        </Text>
      </View>
    ),
  };

  // @ts-ignore
  const projects: Page = {
    backgroundColor: colors.lightGray,
    image: (
      <View style={styles.imageCard}>
        <Image source={Images.onboarding.projects} style={styles.image} />
      </View>
    ),
    subtitle: (
      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          Projects
        </Text>
        <Text style={styles.subtitle}>
          Projects help keep a more detailed log of what you are working on. For example, you might have a goal to write
          for an hour every day, and you might have two projects called "Blog" and "Book."
        </Text>
      </View>
    ),
  };

  // @ts-ignore
  const notifications: Page = {
    backgroundColor: colors.lightGray,
    image: (
      <View style={styles.imageCard}>
        <Image
          source={Platform.OS === 'ios' ? Images.onboarding.notificationsIos : Images.onboarding.notificationsAndroid}
          style={styles.image} />
      </View>
    ),
    subtitle: (
      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          One Last Thing
        </Text>
        <Text style={styles.subtitle}>
          PercentDone uses notifications to notify you when a goal you are tracking is completed. We recommend
          turning notifications on.
        </Text>

        {areNotificationsOn() && (
          <Button color={colors.green} title='Notifications Are On' iconSource={Icons.checkmarkLarge}
                  style={styles.callToAction} disabled />
        )}

        {!areNotificationsOn() && (
          <Button title='Turn On Notifications' style={styles.callToAction} onPress={onTurnOnNotificationsPress} />
        )}
      </View>
    ),
  };

  const pages = [
    welcome,
    goals,
    swipeToTrack,
    streak,
    projects,
    notifications,
  ];

  return (
    <OnboardingSwiper
      pages={pages}
      containerStyles={styles.container}
      imageContainerStyles={styles.imageContainer}
      onSkip={onSkip}
      onDone={onDone}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    paddingVertical: 160,
    paddingHorizontal: 30,
  },
  imageContainer: {
    borderRadius: 10,
  },
  imageCard: {
    position: 'absolute',
    bottom: isScreenSmall() ? 20 : 50,
    width: '100%',
    overflow: 'visible',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 15,
  },
  image: {
    width: '100%',
    height: 148.5,
    resizeMode: 'contain',
    overflow: 'hidden',
    borderRadius: 10,
  },
  logo: {
    width: 150,
    height: 150,
  },
  infoContainer: {
    height: '35%',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.offBlack,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.darkBlue,
    textAlign: 'center',
  },
  callToAction: {
    marginTop: isScreenSmall() ? 10 : 40,
  },
});
