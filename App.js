import 'react-native-gesture-handler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/home';
import { useNetInfo } from '@react-native-community/netinfo';

const Stack = createStackNavigator();

const App = () => {
  const netInfo = useNetInfo();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Flickr Search',
            headerStyle: {
              backgroundColor: netInfo.isConnected ? '#f4511e' : '#808080',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
