import React, { Component } from 'react';
import { Dimensions, Text, ScrollView, View, Image, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator } from 'react-native';

export class LoadingView extends Component {
    render() {
        return (
            <View style={styles.loadingView}>
                <ActivityIndicator color="#00b050" size={30} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
})