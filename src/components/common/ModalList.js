import React from 'react';
import { Overlay, ListItem } from 'react-native-elements';

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
            bottomDivider
            containerStyle={{
              width: '100%',
            }}
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
