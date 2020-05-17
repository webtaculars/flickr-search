import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { Input, Button } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { searchImages } from '../../services/home';
import FastImage from 'react-native-fast-image';
import { width } from '../../utils/device';
import { gridList } from '../../utils/grid';
import Icon from 'react-native-vector-icons/Fontisto';
import ModalList from '../../components/common/ModalList';

export class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      imageList: [],
      column: 3,
      page: 0,
      gridModalVisibility: false,
      ModalVisibleStatus: false,
    };
    this.page = 0;
    this.offset = 24;
    this.timeout = null;
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          containerStyle={{
            width: 40,

            marginRight: 10,
            backgroundColor: 'black',
          }}
          buttonStyle={{ backgroundColor: '#f4511e' }}
          titleStyle={{ fontSize: 18 }}
          icon={<Icon name="nav-icon-grid" size={18} color="white" />}
          onPress={this.gridModalToggle}
        />
      ),
    });
  }

  onChange = search => {
    this.timeout && clearTimeout(this.timeout);
    this.setState({ search, imageList: [] }, () => {
      if (search.length > 0)
        this.timeout = setTimeout(() => {
          this.page = 1;
          this.search();
        }, 500);
    });
  };

  search = async (loadMore = false) => {
    const { search } = this.state;
    try {
      let result = await searchImages(search, this.page, this.offset);

      if (result.data && result.data.photos) {
        loadMore
          ? this.setState(prevState => ({
              imageList: prevState.imageList.concat(result.data.photos.photo),
            }))
          : this.setState({
              imageList: result.data.photos.photo,
            });
      }
    } catch (e) {
      alert('API not reachable');
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item: { farm, server, id, secret } }) => {
    const { column } = this.state;
    return (
      <FastImage
        source={{
          uri: `http://farm${farm}.static.flickr.com/${server}/${id}_${secret}.jpg`,
        }}
        style={{
          width: width / column,
          height: width / column,
          margin: 2,
        }}
      />
    );
  };

  setGrid = item => {
    this.setState({ column: item.column, gridModalVisibility: false });
  };

  gridModalToggle = () => {
    this.setState(prevState => ({
      gridModalVisibility: !prevState.gridModalVisibility,
    }));
  };

  render() {
    const { search, imageList, column, gridModalVisibility } = this.state;
    return (
      <View style={styles.body}>
        <View
          style={{
            flexDirection: 'row',
            width: width,
          }}>
          <Input
            placeholder="Search Pictures..."
            name="search"
            value={search}
            onChangeText={text => this.onChange(text)}
            returnKeyType={'search'}
          />
        </View>
        <ModalList
          list={gridList}
          onPress={this.setGrid}
          visibility={gridModalVisibility}
          setVisibility={this.gridModalToggle}
        />
        {imageList.length > 0 ? (
          <FlatList
            keyExtractor={this.keyExtractor}
            data={imageList}
            renderItem={this.renderItem}
            key={column}
            numColumns={column}
            contentContainerStyle={{
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}
            onEndReached={() => {
              this.page = this.page + 1;
              this.search(true);
            }}
            onEndReachedThreshold={0.8}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});
