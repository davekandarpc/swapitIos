import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, View, Image, Text, InteractionManager, Pressable, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import DropDownPicker from 'react-native-dropdown-picker';
import { showToast } from '../../common/Toaster'
import AsyncStorage from '@react-native-community/async-storage';

export default class RegisterationScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            confirmPassword: '',
            phone: '',
            submitting: false,
            message: '',
            message_error: '',
            ValidEmail: false,
            confirmation: null,
            code: '',
            loading: false,
            selectedCountryCode: '',
            countryCodes: [{ label: '', value: '' }],
            isDropdownOpen: false,
            minheight: false,
            emalSent: false
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true,

            })
        });
    }

    validateEmail = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            this.setState({ email: text })
            return false;
        }
        else {
            this.setState({ email: text, ValidEmail: true })
        }
    }

    doValidateForm = () => {
        this.setState({ loading: true })
        var formIsNotFilled = false
        let formValues = ["first_name", "last_name", "email", "password", "confirmPassword"]
        for (let i = 0; i < formValues.length; i++) {
            if (this.state[formValues[i]] === '') {
                formIsNotFilled = true
            }
        }
        if (formIsNotFilled) {
            this.setState({ sendingOtp: false })
            showToast('Please fill up all the fields', "warning")
        } else {
            const { password, confirmPassword } = this.state
            if (password === confirmPassword) {
                if (this.state.ValidEmail === true) {
                    this.callRegistrationAPI()
                } else {
                    showToast('Please enter a valid email', "warning")
                }
            } else {
                showToast('Password and Confirm password must be same', "warning")
            }
            this.setState({ sendingOtp: false })
        }

    }

    callRegistrationAPI = async () => {
        const { first_name, last_name, email, password } = this.state
        var formData = new FormData()
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('email', email);
        formData.append('password', password);
        let response = await APICALL('authentication/registration', 'POST', formData)
        this.setState({ loading: false })
        if (response.status === 'success') {
            showToast(response.message)
            // this.props.navigation.replace('Login')
            this.setState({ emalSent: true })
        } else {
            let message = 'Something went wrong'
            if (response.message !== undefined) {
                message = response.message
                showToast(message, 'error')
            }
        }
    }

    goToLogin = () => {
        this.props.navigation.replace('Login')
    }

    render() {
        const { isReady, first_name, last_name, email, password, confirmPassword, emalSent, loading } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                {/* <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={}> */}
                    <Header backButton={true} />
                    {
                        !isReady ?
                            <LoadingView />
                            :
                            <ScrollView contentContainerStyle={styles.scrlView_container}>
                                {emalSent ?
                                    <View style={styles.emailSentView}>
                                        <Text style={styles.emailSentText}>An email verification link is sent to your email, please check your email and verify then you will be able to login</Text>
                                        <TouchableOpacity style={styles.goToLoginButton} onPress={this.goToLogin}>
                                            <Text style={styles.goToLoginButtonText}>Go to Login</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <>
                                        <TextInput
                                            placeholder={"First Name:"}
                                            placeholderTextColor="#fff"
                                            style={styles.textInputStyle}
                                            value={first_name}
                                            onChangeText={(first_name) => this.setState({ first_name })}
                                        />
                                        <TextInput
                                            placeholder={"Last Name:"}
                                            placeholderTextColor="#fff"
                                            style={styles.textInputStyle}
                                            value={last_name}
                                            onChangeText={(last_name) => this.setState({ last_name })}
                                        />
                                        <TextInput
                                            placeholder={"Email:"}
                                            placeholderTextColor="#fff"
                                            style={styles.textInputStyle}
                                            keyboardType={'email-address'}
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
                                        <TextInput
                                            placeholder={"Confirm Password:"}
                                            placeholderTextColor="#fff"
                                            style={styles.textInputStyle}
                                            value={confirmPassword}
                                            secureTextEntry={true}
                                            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                                        />
                                        {
                                            !loading ?
                                                <TouchableOpacity style={styles.submitButton} onPress={this.doValidateForm}>
                                                    <Text style={styles.submitButtonText}>Register</Text>
                                                </TouchableOpacity>
                                                :
                                                <ActivityIndicator size={30} style={{ marginTop: 20 }} color="#00b050" />
                                        }
                                        <View style={styles.noteTextView}>
                                            <Text style={styles.submitButtonText}>{this.state.message}</Text>
                                            <Text style={[styles.submitButtonText, { color: 'red' }]}>{this.state.message_error}</Text>
                                        </View>
                                    </>
                                }
                            </ScrollView>
                    }
                {/* </KeyboardAvoidingView> */}
            </SafeAreaView>
        );
    }
}