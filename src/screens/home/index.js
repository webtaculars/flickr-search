import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { searchImages } from '../../services/home';
import FastImage from 'react-native-fast-image';
import { width } from '../../utils/device';
import { gridList } from '../../utils/grid';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import ModalList from '../../components/common/ModalList';
import { saveToDB, readFromDB } from '../../utils/offline';
import constants from '../../constants';
import NetInfo from '@react-native-community/netinfo';

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
      searchHistory: [],
    };
    this.page = 0;
    this.offset = 24;
    this.timeout = null;
  }

  componentDidMount = async () => {
    const { navigation } = this.props;

    navigation.setOptions({
      headerRight: () => (
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
              onPress={this.gridModalToggle}
            />
          }
          onPress={this.gridModalToggle}
        />
      ),
    });
    this.loadHistory();
  };

  loadHistory = async () => {
    let data = await AsyncStorage.getItem(constants.SEARCH_HISTORY);
    if (data) {
      this.setState({
        searchHistory: JSON.parse(data),
      });
    }
  };

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
      const { isConnected } = await NetInfo.fetch();
      if (isConnected) {
        let result = {};
        result = await searchImages(search, this.page, this.offset);
        if (result.data && result.data.photos) {
          loadMore
            ? this.setState(prevState => ({
                imageList: prevState.imageList.concat(result.data.photos.photo),
              }))
            : this.setState(
                prevState => ({
                  imageList: result.data.photos.photo,
                  searchHistory: prevState.searchHistory.concat(search),
                }),
                () => {
                  saveToDB(search, this.state.imageList);
                  AsyncStorage.setItem(
                    constants.SEARCH_HISTORY,
                    JSON.stringify(this.state.searchHistory),
                  );
                },
              );
        }
      } else {
        let savedResult = await readFromDB(search);
        let imageList = JSON.parse(JSON.stringify(savedResult[0])).result;
        this.setState({
          imageList: JSON.parse(imageList),
        });
      }
    } catch (e) {
      alert('API not reachable');
    }
  };

  keyExtractor = (item, index) => index.toString();

  keyExtractorHistory = (item, index) => index.toString();

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

  renderHistory = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 5,
        }}
        onPress={() =>
          this.setState(
            {
              search: item,
            },
            () => {
              this.search(item);
            },
          )
        }>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Fontisto
            name="clock"
            size={18}
            color={constants.Colors.theme}
            style={{ marginHorizontal: 20 }}
          />
          <Text style={{ fontSize: 18 }}>{item}</Text>
        </View>
        <Feather
          name="arrow-up-left"
          size={25}
          color={constants.Colors.theme}
          style={{ marginHorizontal: 10 }}
        />
      </TouchableOpacity>
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
    const {
      search,
      imageList,
      column,
      gridModalVisibility,
      searchHistory,
    } = this.state;
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
        ) : (
          <FlatList
            keyExtractor={this.keyExtractorHistory}
            data={searchHistory}
            renderItem={this.renderHistory}
            contentContainerStyle={{}}
          />
        )}
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
