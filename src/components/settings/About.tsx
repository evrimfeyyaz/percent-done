import React, { FunctionComponent } from 'react';
import { Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { textStyles } from '../../theme';
import { Button } from '..';
import { Icons } from '../../../assets';

export const About: FunctionComponent = () => {
  const twitterBlue = '#1DA1F2';
  const githubGray = '#f6f8fa';
  const githubGrayDark = '#24292e';
  const icons8Green = '#0ca940';
  const notificationSoundsRed = '#b2313d';

  const handleFollowOnTwitterPress = () => {
    Linking.openURL('https://twitter.com/evrimfeyyaz');
  };

  const handleVisitWebsitePress = () => {
    Linking.openURL('https://evrim.io');
  };

  const handleViewSourceCodePress = () => {
    Linking.openURL('https://github.com/evrimfeyyaz/percent-done');
  };

  const handleGoToIcons8Press = () => {
    Linking.openURL('https://icons8.com');
  };

  const handleGoToNotificationSoundsPress = () => {
    Linking.openURL('https://notificationsounds.com/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={[textStyles.body, styles.text]}>
        Created by Evrim Persembe.
      </Text>
      <Button title='Follow Me on Twitter' color={twitterBlue} style={styles.button} iconSource={Icons.twitter}
              onPress={handleFollowOnTwitterPress} />
      <Button title='Visit My Website' style={styles.button} iconSource={Icons.evrim}
              onPress={handleVisitWebsitePress} />

      <Text style={[textStyles.body, styles.text, styles.newParagraph]}>
        The source code of this application is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike
        4.0 International License.
      </Text>
      <Button title='View the Source Code on GitHub' color={githubGray} titleColor={githubGrayDark}
              style={styles.button} iconSource={Icons.github} onPress={handleViewSourceCodePress} />

      <Text style={[textStyles.body, styles.text, styles.newParagraph]}>
        The icons used in this application are made by Icons8.
      </Text>
      <Button title='Visit Icons8' color={icons8Green} style={styles.button} iconSource={Icons.icons8}
              onPress={handleGoToIcons8Press} />

      <Text style={[textStyles.body, styles.text, styles.newParagraph]}>
        The notification sound is from Notification Sounds.
      </Text>
      <Button title='Visit Notification Sounds' color={notificationSoundsRed} style={styles.button}
              onPress={handleGoToNotificationSoundsPress} />
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
    textAlign: 'center',
    marginBottom: 20,
  },
  newParagraph: {
    marginTop: 40,
  },
  button: {
    marginBottom: 10,
  },
});
