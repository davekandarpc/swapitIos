import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, View, TextInput, Text, InteractionManager, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'
import AsyncStorage from '@react-native-community/async-storage';
export default class ResetPasswordScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message_error: "",
            oldPassword: '',
            newPassword: '',
            loginData: null
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getLoginData()
            this.setState({
                isReady: true
            })
        });
    }

    getLoginData = async () => {
        try {
            const value = await AsyncStorage.getItem('loginData');
            if (value !== null) {
                console.log('login data', JSON.parse(value));
                this.setState({ loginData: JSON.parse(value) })
            }
        } catch (error) {

        }
    }

    resetPassword = () => {
        if (this.state.loginData !== null) {
            var formIsNotFilled = false
            let formValues = ["oldPassword", "newPassword"]
            for (let i = 0; i < formValues.length; i++) {
                if (this.state[formValues[i]] === '') {
                    formIsNotFilled = true
                }
            }
            if (formIsNotFilled) {
                showToast('Please fill up all the fields', "warning")
            } else {
                this.setState({ loading: true }, async () => {
                    const { oldPassword, newPassword, loginData } = this.state
                    var formData = new FormData()
                    formData.append('id', loginData.id);
                    formData.append('password', oldPassword);
                    formData.append('newpassword', newPassword);
                    console.log('formData', formData)
                    let response = await APICALL('authentication/changepassword', 'POST', formData)
                    if (response.status === 'success') {
                        this.setState({ message: response.message })
                        showToast(response.message)
                        this.props.navigation.goBack()
                    } else {
                        let message = 'Something went wrong'
                        if (response.message !== undefined) {
                            message = response.message
                        }
                        showToast(message, 'error')
                    }
                    this.setState({ loading: false })
                })
            }
        }
    }

    render() {
        const { isReady, oldPassword, newPassword, loading } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Header backButton={true} /* appTitle={global.settings[0].value} */ />
                {
                    !isReady ?
                        <LoadingView />
                        :
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                            <TextInput
                                placeholder={"Old Password"}
                                placeholderTextColor="#fff"
                                style={styles.textInputStyle}
                                onChangeText={(oldPassword) => this.setState({ oldPassword })}
                                value={oldPassword}
                            />

                            <TextInput
                                placeholder={"New Password"}
                                placeholderTextColor="#fff"
                                style={styles.textInputStyle}
                                onChangeText={(newPassword) => this.setState({ newPassword })}
                                value={newPassword}
                            />

                            {!loading ?
                                <TouchableOpacity style={styles.submitButton} onPress={this.resetPassword}>
                                    <Text style={styles.submitButtonText}>Change Password</Text>
                                </TouchableOpacity>
                                :
                                <ActivityIndicator size={30} style={{ marginTop: 20 }} color="#00b050" />
                            }
                            <View style={styles.noteTextView}>
                                <Text style={[styles.submitButtonText, { color: '#00b050' }]}>{this.state.message}</Text>
                                <Text style={[styles.submitButtonText, { color: 'red' }]}>{this.state.message_error}</Text>
                            </View>
                        </ScrollView>
                }
            </SafeAreaView>
        );
    }
}