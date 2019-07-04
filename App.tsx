import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import Storybook from './storybook';

export default Storybook;
// export default class App extends Component<{}, {}> {
//   render() {
//     return (
//       <View style={styles.container}>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
  },
});