import React, { Component } from 'react';
import { Dimensions, Text, StyleSheet, View, Image, TouchableOpacity, Animated, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import AsyncStorage from '@react-native-community/async-storage';
import { APICALL } from '../common/ApiCaller'
AntDesign.loadFont();

let width = Dimensions.get('window').width
let Height = Dimensions.get('window').height
export class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalY: new Animated.Value(-Height),
            showModal: false,
            menuOptions: [
                {
                    name: 'Register',
                    route: 'RegisterationScreen'
                },
                {
                    name: 'Login',
                    route: 'Login'
                },
                {
                    name: 'Reset Password',
                    route: 'ResetPasswordScreen'
                },
                {
                    name: 'My Subscription',
                    route: 'SubscriptionScreen'
                },
                {
                    name: 'Post a Swaparoo’s',
                    route: 'CategorySelectionScreen'
                },
                {
                    name: 'Messages',
                    route: 'MessagesScreen'
                },
                {
                    name: 'MySwaparoo',
                    route: 'MySwaparooScreen' //ScanBarCodeScreen
                },
                {
                    name: 'Wallet',
                    route: 'ScanBarCodeScreen_copy' //
                },
                {
                    name: 'Privacy Policy',
                    route: 'PrivacyPolicyScreen'
                },
                {
                    name: 'Terms and Conditions',
                    route: 'TermsConditionScreen'
                },
                {
                    name: 'Contact Us',
                    route: 'ContactUs'
                }
            ],
            loginData: null
        }
    }

    openMenu = () => {
        this.setState({ showModal: !this.state.showModal }, () => {
            Animated.timing(this.state.modalY, {
                duration: 300,
                toValue: 0,
                useNativeDriver: true
            }).start();
        })
        this.getLoginData()
    }

    getLoginData = async () => {
        try {
            const value = await AsyncStorage.getItem('loginData');
            if (value !== null) {
                this.setState({ loginData: JSON.parse(value) }, () => {
                    this.getMessageCount()
                })
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    getMessageCount = async () => {
        const { loginData, menuOptions } = this.state
        let response = await APICALL(`message/messagcount/${loginData.id}`, 'GET')
        if (response.status === 'success' && response.data) {
            menuOptions.find((o, i) => {
                if (o.name === 'Messages') {
                    menuOptions[i] = { name: 'Messages', route: 'MessagesScreen', count: response.count };
                    return true; // stop searching
                }
            });
            this.setState({ menuOptions })
        }
    }

    closeMenu = () => {
        Animated.timing(this.state.modalY, {
            duration: 300,
            toValue: -Height,
            useNativeDriver: true
        }).start();
        this.setState({ showModal: false })
    }

    goBack = () => {
        global.myNavigation.goBack(null)
        return
    }

    onSelectMenuOption = (item) => {
        this.closeMenu()
        if (item === 'Logout') {
            this.removeLoginData()
        } else {
            console.log('global.userSubscriptionStatus: ', global.userSubscriptionStatus)
            if (item.name === 'My Subscription' || item.name === 'Myswaparoo') {
                if (global.isLoggedIn === undefined) {
                    global.myNavigation.navigate('Login')
                } else if (!global.isLoggedIn) {
                    global.myNavigation.navigate('Login')
                } else {
                    global.myNavigation.navigate(item.route)
                }
            } else if (item.name === 'Post a Swaparoo' || item.name === 'Messages' || item.name === 'Contact Us') {
                if (global.isLoggedIn === undefined) {
                    global.myNavigation.navigate('Login')
                } else if (!global.isLoggedIn) {
                    global.myNavigation.navigate('Login')
                }
                // else if (global.userSubscriptionStatus === 'No') {
                //     global.myNavigation.navigate('SubscriptionScreen', { goTo: 'PostSwap' })
                // } 
                else {
                    global.myNavigation.navigate(item.route)
                }
            } else {
                global.myNavigation.navigate(item.route)
            }
        }
    }

    removeLoginData = async () => {
        try {
            await AsyncStorage.removeItem('loginData')
            await AsyncStorage.removeItem('userSubscriptionStatus')
            global.isLoggedIn = false;
            global.userSubscriptionStatus = null
            global.myNavigation.navigate('Login')
        } catch (err) {
            console.log('err: ', err)
        }
    }

    render() {
        const { menuOptions } = this.state
        return (
            <View style={Platform.OS === 'ios' ? { zIndex: +1 } : null}>
                <Animated.View style={[styles.modal, { transform: [{ translateY: this.state.modalY }] }]}>
                    <TouchableOpacity onPress={this.closeMenu} underlayColor="green" style={styles.button}>
                        <AntDesign name="close" size={40} color="#989898" />
                    </TouchableOpacity>
                    {
                        menuOptions.map((item, index) => {
                            return (
                                index === 2 ?
                                    global.isLoggedIn &&
                                    <TouchableOpacity
                                        onPress={() => {
                                            index === 1 ?
                                                !global.isLoggedIn ? this.onSelectMenuOption(item) : this.onSelectMenuOption('Logout')
                                                :
                                                this.onSelectMenuOption(item)
                                        }
                                        }
                                        style={[
                                            styles.menuItem, index === menuOptions.length - 1 &&
                                            { borderBottomWidth: 0 }
                                        ]}
                                        key={'key' + index}
                                    >
                                        <Text style={styles.menuItemText}>
                                            {index === 1 ? !global.isLoggedIn ? item.name : 'Logout' : item.name}
                                        </Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => {
                                            index === 1 ?
                                                !global.isLoggedIn ? this.onSelectMenuOption(item) : this.onSelectMenuOption('Logout')
                                                :
                                                this.onSelectMenuOption(item)
                                        }
                                        }
                                        style={[
                                            styles.menuItem, index === menuOptions.length - 1 &&
                                            { borderBottomWidth: 0 }
                                        ]}
                                        key={'key' + index}
                                    >

                                        {index == 7 && <Text></Text>}
                                        <Text style={styles.menuItemText}>
                                            {index === 1 ? !global.isLoggedIn ? item.name : 'Logout' : item.name}
                                            {item.count && ` (${item.count})`}
                                        </Text>
                                    </TouchableOpacity>
                            )
                        })
                    }
                </Animated.View>
                <View style={styles.mainContainer}>
                    {
                        this.props.backButton &&
                        <TouchableOpacity onPress={this.goBack} style={styles.backIconStyle}>
                            <Image source={require('../assets/images/swapitBackArrow.png')} style={styles.backIcon} />
                        </TouchableOpacity>
                    }

                    <View style={this.props.backButton ? styles.headerLogoViewWithBackButton : styles.headerLogoView}>
                        <Image source={require('../assets/images/appLogo.png')} style={styles.headerLogo} />
                    </View>
                    <TouchableOpacity onPress={this.openMenu} style={{ marginRight: 20 }}>
                        <Image source={require('../assets/images/swapitMenu.png')} style={styles.menuIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomWidth: 1,
        borderBottomColor: '#989898',
    },
    backIconStyle: {
        marginLeft: 20
    },
    headerLogoViewWithBackButton: {
        marginLeft: width / 2 - 90,
        flex: 1
    },
    headerLogoView: {
        marginLeft: width / 2 - 30,
        flex: 1
    },
    headerLogo: {
        height: 60,
        width: 60,
        resizeMode: 'contain'
    },
    menuIcon: {
        height: 45,
        width: 45,
        resizeMode: 'contain'
    },
    backIcon: {
        height: 40,
        width: 40,
        resizeMode: 'contain'
    },
    appTitleStyle: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
        fontStyle: 'italic'
    },
    modal: {
        width: width,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#595959',
        justifyContent: 'center',
        zIndex: +1,
        paddingHorizontal: 16,
        paddingTop: 12,
        borderWidth: 1,
        borderColor: '#8c8c8c'
    },
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#8c8c8c',
        paddingVertical: 12,
        flexDirection: 'row'
    },
    menuItemText: {
        color: '#fff',
        fontSize: 16,
        alignSelf: 'center'
    },
    button: {
        alignSelf: 'flex-end'
    }
})