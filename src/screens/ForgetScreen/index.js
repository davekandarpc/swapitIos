import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, View, TextInput, Text, InteractionManager, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { showToast } from '../../common/Toaster'
Entypo.loadFont();
export default class ForgetScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
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

    forgotPassword = () => {
        var formIsNotFilled = false
        let formValues = ["email"]
        for (let i = 0; i < formValues.length; i++) {
            if (this.state[formValues[i]] === '') {
                formIsNotFilled = true
            }
        }
        if (formIsNotFilled) {
            showToast('Please fill up all the fields', "warning")
        } else {
            this.setState({ logging: true }, async () => {
                const { email, logging } = this.state

                var formData = new FormData()
                formData.append('email', email);

                if (this.state.ValidEmail == true) {
                    let response = await APICALL('authentication/forgotpassword', 'POST', formData)
                    if (response.status === 'success') {
                        this.setState({ message: response.message })
                    } else {
                        let message = 'Something went wrong'
                        if(response.message !== undefined) {
                            message = response.message
                        }
                        showToast(message, 'error')
                    }
                }
                else {
                    showToast("Please enter a valid email", "warning");
                }
                this.setState({ logging: false })
            })
        }
    }

    validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            this.setState({ email: text })
            return false;
        }
        else {
            this.setState({ email: text, ValidEmail: true })
        }
    }

    render() {
        const { isReady, email, logging } = this.state
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

                            {!logging ?
                                <TouchableOpacity style={styles.submitButton} onPress={this.forgotPassword}>
                                    <Text style={styles.submitButtonText}>Submit</Text>
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
                {/* {
                    isReady &&
                    <BottomButtons showBlankView={true} />
                } */}
            </SafeAreaView>
        );
    }
}