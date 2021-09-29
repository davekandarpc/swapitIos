import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, View, Image, Text, InteractionManager, Pressable, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import DropDownPicker from 'react-native-dropdown-picker';
import { showToast } from '../../common/Toaster'
import auth from '@react-native-firebase/auth';

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
            sendingOtp: false,
            selectedCountryCode: '',
            countryCodes: [{ label: '', value: '' }],
            isDropdownOpen: false,
            minheight:false
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true,
                
            })
            this.getCountryCodes()
        });
    }

    getCountryCodes = async () => {
        this.setState({ loading: true }, async () => {
            let response = await APICALL('membership/countries', 'GET')
            this.setState({ loading: false })
            if (response.status === 'success') {
                if (response.data) {
                    let countryCodes = []
                    for (let i = 0; i < response.data.length; i++) {
                        let obj = {
                            label: `${response.data[i].country_code} (${response.data[i].phone_code})`,
                            value: response.data[i].phone_code
                        }
                        countryCodes.push(obj)
                    }
                    this.setState({ countryCodes })
                }
            } else {
                let message = 'Something went wrong'
                if (response.message !== undefined) {
                    message = response.message
                }
                showToast(message, 'error')
            }
        })
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
        this.setState({ sendingOtp: true })
        var formIsNotFilled = false
        let formValues = ["first_name", "last_name", "email", "phone", "password", "confirmPassword", "selectedCountryCode"]
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
                    this.signInWithPhoneNumber()
                } else {
                    showToast('Please enter a valid email', "warning")
                }
            } else {
                showToast('Password and Confirm password must be same', "warning")
            }
            this.setState({ sendingOtp: false })
        }

    }

    setConfirm = (confirmation) => {
        this.setState({ confirmation })
    }

    signInWithPhoneNumber = async () => {
        const { first_name, last_name, email, phone, password, selectedCountryCode } = this.state
        let phoneWithCode = selectedCountryCode + ' ' + phone
        // try {
        //     var confirmation = await auth().signInWithPhoneNumber(phoneWithCode);
        //     this.setConfirm(confirmation);
        //     this.setState({ sendingOtp: false })
        //     this.props.navigation.navigate('CodeVerificationScreen', {
        //         first_name, last_name, email, phone: phoneWithCode, password, confirmation
        //     })
        // } catch (err) {
        //     this.setState({ sendingOtp: false })
        //     alert('OTP not sent, try again!')
        // }
        this.props.navigation.navigate('CodeVerificationScreen', {
            first_name, last_name, email, phone: phoneWithCode, password
        })
    }

    toggleDropdown = () => {
        const { isDropdownOpen } = this.state;
        this.setState({ isDropdownOpen: !isDropdownOpen,minheight:!this.state.minheight })
    }

    render() {
        const { isReady, first_name, last_name, email, password, confirmPassword, phone, sendingOtp, countryCodes, selectedCountryCode, isDropdownOpen } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={40}>
                    <Header backButton={true} />
                    {
                        !isReady ?
                            <LoadingView />
                            :
                            <ScrollView contentContainerStyle={styles.scrlView_container}>
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
                                <View style={{minHeight:this.state.minheight === false ? 0 : 300}}>
                                <DropDownPicker
                                    items={countryCodes}
                                    onOpen={this.toggleDropdown}
                                    onClose={this.toggleDropdown}
                                    defaultValue={selectedCountryCode}
                                    containerStyle={{ height: 40, marginHorizontal: 48, marginTop: 10 }}
                                    style={{ backgroundColor: '#a6a6a6', borderColor: '#a6a6a6' }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                                    arrowColor={'#fff'}
                                    selectedLabelStyle={{ color: '#fff' }}
                                    placeholderStyle={{ color: '#fff' }}
                                    placeholder="Select Country Code"
                                    onChangeItem={item => this.setState({ selectedCountryCode: item.value })}
                                />
                                </View>
                               
                                {
                                    !isDropdownOpen &&
                                    <TextInput
                                        placeholder={"Enter Your Phone Number"}
                                        placeholderTextColor="#fff"
                                        keyboardType="number-pad"
                                        style={styles.textInputStyle}
                                        value={phone}
                                        onChangeText={(phone) => this.setState({ phone })}
                                    />
                                }
                                {
                                    !isDropdownOpen ?
                                        !sendingOtp ?
                                            <TouchableOpacity style={styles.submitButton} onPress={this.doValidateForm}>
                                                <Text style={styles.submitButtonText}>Get OTP</Text>
                                            </TouchableOpacity>
                                            :
                                            <ActivityIndicator size={30} style={{ marginTop: 20 }} color="#00b050" />
                                        :
                                        null
                                }
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
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}