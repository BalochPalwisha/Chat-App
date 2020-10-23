/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import AppNavigator from './src/navigation/index'
import AuthProvider from './src/context/auth/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
    <AppNavigator/>
    </AuthProvider>
  );
};


export default App;
