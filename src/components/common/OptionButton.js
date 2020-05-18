import React from 'react';
import { Button } from 'react-native-elements';
import Fontisto from 'react-native-vector-icons/Fontisto';

export const OptionButton = props => {
  return (
    <Button
      containerStyle={{
        width: 40,
        marginRight: 10,
      }}
      buttonStyle={{ backgroundColor: 'transparent' }}
      titleStyle={{ fontSize: 18 }}
      icon={
        <Fontisto
          name="nav-icon-grid"
          size={18}
          color="white"
          onPress={props.onPress}
        />
      }
      onPress={props.onPress}
    />
  );
};
