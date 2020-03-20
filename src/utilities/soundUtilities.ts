import { Player } from '@react-native-community/audio-toolkit';

export function playBreakNotificationSound() {
  new Player('arpeggio.mp3').play();
}

export function playGoalCompletedNotificationSound() {
  new Player('eventually.mp3').play();
}
