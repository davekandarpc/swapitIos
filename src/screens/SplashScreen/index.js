import React, { Component } from 'react';
import { Dimensions, Text, ScrollView, View, Image, InteractionManager, Pressable, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { StackActions, NavigationActions } from 'react-navigation';
import { showToast } from '../../common/Toaster'
import { APICALL } from '../../common/ApiCaller'
import AsyncStorage from '@react-native-community/async-storage';
import Sound from 'react-native-sound';

export default class SplashScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            settings: null
        }
        global.myNavigation = this.props.navigation
        global.selectedCategory = null
        global.settings = null
        global.latitude = null
        global.longitude = null
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true
            }, () => {
                this.whoosh = new Sound('soundbite.mp3', Sound.MAIN_BUNDLE, (error) => {
                    if (error) {
                        console.log('failed to load the sound', error);
                        return;
                    }
                    this.whoosh.play((success) => {
                        if (success) {
                            console.log('successfully finished playing');
                        } else {
                            console.log('playback failed due to audio decoding errors');
                        }
                    });
                });
                this.authenticateUser()
            })
        });
    }

    getSettings = async () => {
        let response = await APICALL('settings/', 'GET')
        console.log('response' + JSON.stringify(response))
        if (response.status === 'success') {
            if (response.data) {
                global.settings = response.data;
                this.setState({ settings: response.data }, () => {
                    setTimeout(() => {
                        this.navigateToHomeScreen()
                    }, 4000)
                })
            }
        } else {
            let message = 'Something went wrong'
            if (response.message !== undefined) {
                message = response.message
            }
            showToast(message, 'error')
        }
    }

    authenticateUser = async () => {
        try {
            let loginData = await AsyncStorage.getItem('loginData')
            if (loginData !== null) {
                global.isLoggedIn = true
            } else {
                global.isLoggedIn = false
            }
            this.checkMembership(loginData)

            setTimeout(() => {
                this.whoosh.stop(() => {
                    this.whoosh.play();
                    this.whoosh.release();
                });
                this.navigateToHomeScreen()
            }, 4000)
        } catch (err) {
            console.log('err: ', err)
        }
    }

    checkMembership = async (loginData) => {
        let userId = JSON.parse(loginData).id;
        let response = await APICALL(`membership/getdetails/${userId}`, 'GET');
        let membership = response.data.membership;
        this._setuserSubscribed(membership);
        global.userSubscriptionStatus = membership;
    }

    _setuserSubscribed = async (isSubscribed) => {
        try {
            await AsyncStorage.setItem('userSubscriptionStatus', isSubscribed);
        } catch (e) {
            // save error
        }
        console.log('Done.')
    }

    navigateToHomeScreen = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={styles.main_container}>
                <View style={styles.headerLogoView}>
                    {/* <Image source={require('../../assets/images/swaparoo_old_logo.png')} style={styles.headerLogo} /> */}
                    <Image source={require('../../assets/images/appLogo.png')} style={styles.headerLogo} />
                    <Text style={styles.title}>Myswaparoo</Text>
                </View>
            </View>
        );

    }
}