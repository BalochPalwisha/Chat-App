import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import AllUsers from '../screens/AllUsers';
import VideoComponent from '../components/VideoComponent'

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator 
    screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Chat' component={ChatScreen} />
      <Stack.Screen name='People' component={AllUsers} />
      <Stack.Screen name='Video' component={VideoComponent} />
    </Stack.Navigator>
  );
}