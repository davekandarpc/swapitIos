import React, { Component } from 'react';
import { Dimensions, Text, ScrollView, View, Image, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { showToast } from '../common/Toaster'

let width = Dimensions.get('window').width

export class BottomButtons extends Component {
    navigateToScreen = (screen) => {
        if (global.selectedCategory !== null) {
            if (global.isLoggedIn === undefined) {
                global.myNavigation.navigate('Login')
            } else if (!global.isLoggedIn) {
                global.myNavigation.navigate('Login')
            } 
            // else if (global.userSubscriptionStatus === 'No') {
            //     global.myNavigation.navigate('SubscriptionScreen', { goTo: 'PostSwap' })
            // } 
            else {
                global.myNavigation.navigate(screen)
            }
        } else {
            showToast('Please select a category', 'warning')
        }
    }

    render() {
        return (
            // this.props.WithUploadButton ?
            //     <View style={styles.bottomButtonContainers}>
            //         <Pressable onPress={this.navigateToScreen.bind(this, 'UploadScreen')} style={styles.bottomButtonIconLeftStyle}>
            //             <Image source={require('../assets/images/camera.png')} style={styles.cameraIcon} />
            //         </Pressable>
            //         {
            //             this.props.noSocilaMediaIcons === undefined &&
            //             <View style={styles.socialMediaIconsView}>
            //                 <Image source={require('../assets/images/fbLogo.png')} style={styles.socialMediaIcon} />
            //                 <Image source={require('../assets/images/twitterLogo.png')} style={styles.socialMediaIcon} />
            //                 <Image source={require('../assets/images/instaLogo.png')} style={styles.socialMediaIcon} />
            //             </View>
            //         }
            //     </View>
            //     :
            //     this.props.showBlankView === undefined ?
            //         <View style={styles1.bottomButtonContainers}>
            //             <Image source={require('../assets/images/fbLogo.png')} style={styles1.socialMediaIcon} />
            //             <Image source={require('../assets/images/twitterLogo.png')} style={styles1.socialMediaIcon} />
            //             <Image source={require('../assets/images/instaLogo.png')} style={styles1.socialMediaIcon} />
            //         </View>
            //         :
            //         <View style={styles1.bottomButtonContainersBlank} />
            <View style={styles1.onlyCamera}>
                <Pressable onPress={this.navigateToScreen.bind(this, 'UploadScreen')} style={styles.bottomButtonIconLeftStyle}>
                    <Image source={require('../assets/images/camera.png')} style={styles.cameraIcon} />
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomButtonContainers: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        backgroundColor: '#404040',
        paddingVertical: 8,
        alignItems: 'center',
    },
    bottomButtonIconLeftStyle: {
        marginBottom: 10
    },
    socialMediaIconsView: {
        flexDirection: 'row',
        position: 'absolute',
        left: width / 2 - 60,
    },
    socialMediaIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginLeft: 5,
        marginRight: 5
    },
    cameraIcon: {
        height: 45,
        width: 45,
        resizeMode: 'contain'
    }
})

const styles1 = StyleSheet.create({
    bottomButtonContainersBlank: {
        height: 40,
        paddingHorizontal: 16,
        backgroundColor: '#404040',
    },
    bottomButtonContainers: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        backgroundColor: '#404040',
        paddingVertical: 10,
        justifyContent: 'center'
    },
    bottomButtonIconLeftStyle: {
        flex: 1
    },
    socialMediaIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginLeft: 5,
        marginRight: 5
    },
    onlyCamera: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})