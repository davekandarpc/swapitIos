import React, { Component } from 'react';
import { Dimensions, Text, ScrollView, View, Image, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import {LoadingView} from './LoadingView'

let height = Dimensions.get('window').height
let width = Dimensions.get('window').width

export class Loader extends Component {
    render() {
        return (
            <View style={styles.loader}>
                <LoadingView />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loader: {
        height, 
        width, 
        backgroundColor: 'rgba(0,0,0,0.4)', 
        position: 'absolute', 
        justifyContent: 'center', 
        alignItems: 'center',
        zIndex: +1
    }
})