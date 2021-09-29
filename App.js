
import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import AppContainer from './src/Navigator/AppNavigation'
export default class App extends React.Component {
  render() {
    return (
        <AppContainer />
    );
  }
}

