import { Player } from '@react-native-community/audio-toolkit';

export function playBreakNotificationSound() {
  new Player('arpeggio.mp3').play();
}
