import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, View, TextInput, Image, Text, InteractionManager, Pressable, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
Entypo.loadFont();
export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            message: "",
            message_error: "",
            ValidEmail: false
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true,
                logging: false
            })
        });
    }

    validateEmail = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            // showToast("Please Enter Valid Email","warning");
            this.setState({ email: text })
            return false;
        }
        else {
            this.setState({ email: text, ValidEmail: true })
            //   showToast("Email is Correct","Ok");
        }
    }

    login = () => {
        var formIsNotFilled = false
        let formValues = ["email", "password",]
        for (let i = 0; i < formValues.length; i++) {
            if (this.state[formValues[i]] === '') {
                formIsNotFilled = true
            }
        }
        if (formIsNotFilled) {
            showToast('Please fill up all the fields', "warning")
        } else {
            this.setState({ logging: true }, async () => {
                const { email, password } = this.state
                var formData = new FormData()
                formData.append('email', email);
                formData.append('password', password);

                if (this.state.ValidEmail == true) {
                    let response = await APICALL('authentication/login', 'POST', formData)
                    if (response.status === 'success') {
                        global.isLoggedIn = true

                        this.storeLogindata(response.data)
                        showToast(response.message)
                        global.myNavigation.navigate('HomeScreen')
                        this.setState({ email: '', password: '', })
                        console.log('login response: ', response)

                        this.checkMembership(response.data.id)
                    } else {
                        let message = 'Something went wrong'
                        if (response.message !== undefined) {
                            message = response.message
                            showToast(message, 'error')
                        }
                        this.setState({ message_error: response.message })
                    }
                } else {
                    showToast('Please enter a valid email', "warning")
                }
                this.setState({ logging: false })
            })
        }
    }

    checkMembership = async (userId) => {
        let response = await APICALL(`membership/getdetails/${userId}`, 'GET')
        let membership = response.data.membership;
        this._setuserSubscribed(membership)
        this.props.navigation.goBack(null);
    }

    onForgotPassword = () => {
        this.props.navigation.navigate('ForgetScreen')
    }

    storeLogindata = async (value) => {
        try {
            await AsyncStorage.setItem('loginData', JSON.stringify(value))
        } catch (e) {
            // save error
        }
        console.log('Done.')
    }

    _setuserSubscribed = async (isSubscribed) => {
        try {
            await AsyncStorage.setItem('userSubscriptionStatus', isSubscribed)
            global.userSubscriptionStatus = isSubscribed
        } catch (e) {
            // save error
        }
        console.log('Done.')
    }

    onPressToRegister = () => {
        this.props.navigation.navigate('RegisterationScreen')
    }

    render() {
        const { isReady, email, password, logging } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Header backButton={true} /* appTitle={global.settings[0].value} */ />
                {
                    !isReady ?
                        <LoadingView />
                        :
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                            <TextInput
                                placeholder={"Email:"}
                                placeholderTextColor="#fff"
                                style={styles.textInputStyle}
                                keyboardType={"email-address"}
                                onChangeText={(text) => this.validateEmail(text)}
                                value={email}
                            />
                            <TextInput
                                placeholder={"Password:"}
                                placeholderTextColor="#fff"
                                style={styles.textInputStyle}
                                value={password}
                                secureTextEntry={true}
                                onChangeText={(password) => this.setState({ password })}
                            />
                            <TouchableOpacity style={styles.forgotPasswordButtonStyle} onPress={this.onForgotPassword}>
                                <Text style={styles.forgotPasswordTextStyle}>Forgot password</Text>
                            </TouchableOpacity>
                            {!logging ?
                                <TouchableOpacity style={styles.submitButton} onPress={this.login}>
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                                :
                                <ActivityIndicator size={30} style={{ marginTop: 20 }} color="#00b050" />
                            }
                            <TouchableOpacity style={styles.forgotPasswordButtonStyle} onPress={this.onPressToRegister}>
                                <Text style={styles.forgotPasswordTextStyle}>Not registered, Register now</Text>
                            </TouchableOpacity>
                            <View style={styles.noteTextView}>
                                <Text style={styles.submitButtonText}>{this.state.message}</Text>
                                <Text style={[styles.submitButtonText, { color: 'red' }]}>{this.state.message_error}</Text>
                            </View>
                        </ScrollView>
                }
                {/* {
                    isReady &&
                    <BottomButtons showBlankView={true} />
                } */}
            </SafeAreaView>
        );
    }
}