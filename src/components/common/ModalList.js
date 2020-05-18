import React from 'react';
import { Overlay, ListItem } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import constants from '../../constants';

const ModalList = props => {
  const toggleOverlay = () => {
    props.setVisibility(!props.visibility);
  };

  return (
    <Overlay
      isVisible={props.visibility}
      overlayStyle={{ width: '70%' }}
      onBackdropPress={toggleOverlay}>
      <>
        {props.list.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            containerStyle={{
              width: '100%',
            }}
            rightIcon={
              <Feather
                name="check"
                size={24}
                style={
                  props.selected === item.column ? {} : { display: 'none' }
                }
                color={constants.Colors.theme}
                onPress={() => {
                  if (search.length > 0) {
                    this.page = 1;
                    this.search();
                  }
                }}
              />
            }
            onPress={() => {
              props.onPress(item);
            }}
          />
        ))}
      </>
    </Overlay>
  );
};

export default ModalList;
