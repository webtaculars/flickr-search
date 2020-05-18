import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import constants from '../../constants';
import Feather from 'react-native-vector-icons/Feather';

export const HistoryListItem = props => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.row}>
        <Fontisto
          name="clock"
          size={18}
          color={constants.Colors.theme}
          style={styles.icon}
        />
        <Text style={{ fontSize: 18 }}>{props.item}</Text>
      </View>
      <Feather
        name="arrow-up-left"
        size={25}
        color={constants.Colors.theme}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: 20
  }
});
