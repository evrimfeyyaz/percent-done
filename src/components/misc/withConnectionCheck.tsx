import React, { FunctionComponent, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { textStyles } from '../../theme';
import { BackgroundView, TextButton } from '..';

export function withConnectionCheck<T>(WrappedComponent: React.ComponentType<T>) {
  const ComponentWithConnectionCheck: FunctionComponent<T> = (props) => {
    const [isRefreshButtonEnabled, setIsRefreshButtonEnabled] = useState(true);
    const [isConnectedToNet, setIsConnectedToNet] = useState(false);

    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnectedToNet(state.isConnected);
      });

      return () => unsubscribe();
    }, []);

    function handleRefreshPress() {
      setIsRefreshButtonEnabled(false);
      NetInfo.fetch().then(state => {
        setIsConnectedToNet(state.isConnected);
        setIsRefreshButtonEnabled(true);
      });
    }

    if (!isConnectedToNet) {
      return (
        <BackgroundView style={styles.container}>
          <Text style={[textStyles.body, styles.text]}>
            You are not connected to the internet.
          </Text>

          {isRefreshButtonEnabled && (
            <TextButton title='Refresh' onPress={handleRefreshPress} />
          )}
          {!isRefreshButtonEnabled && (
            <ActivityIndicator />
          )}
        </BackgroundView>
      );
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithConnectionCheck.displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  return ComponentWithConnectionCheck;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
  },
});
