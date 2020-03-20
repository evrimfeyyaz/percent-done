import { Player } from '@react-native-community/audio-toolkit';

export function playBreakNotificationSound() {
  new Player(Sounds.breakSound).play();
}

export function playGoalCompletedNotificationSound() {
  new Player(Sounds.goalCompletedSound).play();
}

export const Sounds = {
  breakSound: 'arpeggio.mp3',
  goalCompletedSound: 'eventually.mp3',
};
