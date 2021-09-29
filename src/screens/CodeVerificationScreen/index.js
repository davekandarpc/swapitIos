import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, View, Image, Text, InteractionManager, ActivityIndicator, TextInput } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'
import AsyncStorage from '@react-native-community/async-storage';

export default class CodeVerificationScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            code: '',
            loading: false,
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
            confirmation: null
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.set_stateVariables()
        });
    }

    resendCode = () => {
        this.props.navigation.goBack()
    }

    set_stateVariables = () => {
        prevParams = this.props.navigation.state.params;
        this.setState({
            first_name: prevParams.first_name,
            last_name: prevParams.last_name,
            email: prevParams.email,
            phone: prevParams.phone,
            password: prevParams.password,
            // confirmation: prevParams.confirmation,
            isReady: true
        }, () => {
            setTimeout(() => {
                this.callRegistrationAPI()
            }, 2000)
        })
    }

    confirmCode = async () => {
        this.setState({ loading: true })
        try {
            this.state.confirmation.confirm(this.state.code)
                .then(user => {
                    showToast("OTP Verified successfully, please wait...")
                    this.callRegistrationAPI()
                })
        } catch (error) {
            this.setState({ loading: false })
            showToast("Invalid code", 'error')
        }
    }

    callRegistrationAPI = async () => {
        const { first_name, last_name, email, phone, password } = this.state
        var formData = new FormData()
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        let response = await APICALL('authentication/registration', 'POST', formData)
        if (response.status === 'success') {
            showToast(response.message)
            this._autoLogin()
            // this.props.navigation.replace('Login')
        } else {
            let message = 'Something went wrong'
            if (response.message !== undefined) {
                message = response.message
                showToast(message, 'error')
            }
            this.setState({ message_error: response.message })
            this.setState({ loading: false })
        }
    }

    _autoLogin = async () => {
        const { email, password } = this.state
        var formData = new FormData()
        formData.append('email', email);
        formData.append('password', password);
        let response = await APICALL('authentication/login', 'POST', formData)

        if (response.status === 'success') {
            global.isLoggedIn = true
            this.storeLogindata(response.data)
            showToast(response.message)
            this.setState({ email: '', password: '', })
            // console.log('login response: ', response)
            this._setuserSubscribed(response.data.membership)
        } else {
            let message = 'Something went wrong'
            if (response.message !== undefined) {
                message = response.message
                showToast(message, 'error')
            }
            this.setState({ message_error: response.message })
        }
    }

    storeLogindata = async (value) => {
        try {
            await AsyncStorage.setItem('loginData', JSON.stringify(value))
            this.props.navigation.replace('SubscriptionScreen', { goTo: 'HomeScreen' })
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

    render() {
        const { isReady, code, loading } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Header />
                {
                    // !isReady ?
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <ActivityIndicator color="#00b050" size={30} />
                        <Text style={{color: '#fff'}}>Please Wait..</Text>
                    </View>
                    // :
                    // <ScrollView contentContainerStyle={styles.scrlView_container}>
                    //     <TextInput
                    //         placeholder={"Verification Code:"}
                    //         placeholderTextColor="#fff"
                    //         style={styles.textInputStyle}
                    //         value={code}
                    //         keyboardType={"number-pad"}
                    //         onChangeText={(code) => this.setState({ code })}
                    //     />
                    //     <TouchableOpacity style={styles.resendButtonStyle} onPress={this.resendCode}>
                    //         <Text style={styles.resendTextStyle}>Didn’t receive verification code, send again</Text>
                    //     </TouchableOpacity>
                    //     {!loading ?
                    //         <TouchableOpacity style={styles.submitButton} onPress={this.confirmCode}>
                    //             <Text style={styles.submitButtonText}>Submit</Text>
                    //         </TouchableOpacity>
                    //         :
                    //         <ActivityIndicator size={30} style={{ marginTop: 20 }} color="#00b050" />
                    //     }
                    // </ScrollView>
                }
            </SafeAreaView>
        );
    }
}