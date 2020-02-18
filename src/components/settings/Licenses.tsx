import React, { FunctionComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import _ from 'lodash';
import { MenuLink } from '..';

interface LicensesJsonFormat {
  [library: string]: {
    licenses: string;
    repository: string;
    licenseUrl: string;
  };
}

interface LicensesProps {
  onLibraryPress?: (library: string) => void;
}

export const Licenses: FunctionComponent<LicensesProps> = ({ onLibraryPress }) => {
  const licensesJson = require('../../../licenses.json') as LicensesJsonFormat;
  const licenses = _.keys(licensesJson).map(key => ({
    key: key,
    library: key,
    ...licensesJson[key],
  }));

  return (
    <FlatList
      style={styles.container}
      data={licenses}
      renderItem={({ item }) => (
        <MenuLink title={item.library} onPress={() => onLibraryPress?.(item.library)} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
