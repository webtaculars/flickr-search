import React, { PureComponent } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { Input } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      imageList: [],
    };
  }

  onChange = search => {
    this.setState({ search });
  };

  render() {
    const { search, imageList } = this.state;
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.body}>
          <Input
            placeholder="Search Pictures..."
            name="search"
            value={search}
            onChangeText={text => this.onChange(text)}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});
