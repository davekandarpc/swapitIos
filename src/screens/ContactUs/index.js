import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, TextInput, Image, Modal, InteractionManager, Pressable, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
export default class ContactUs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            terms_condition: '',
            loading: '',
            subject: '',
            comment: '',
            addingComment: '',
            loginData: null,
            sendingData:false
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true,
                loading: true
            }, () => {
                this.getLoginData()
                this.getContactusDetails()
            })
        });
    }
    getLoginData = async () => {
        try {
            const value = await AsyncStorage.getItem('loginData');
            if (value !== null) {
                this.setState({ loginData: JSON.parse(value) })
            }
        } catch (error) {
            // Error retrieving data
        }
    }
    sendData =() => {
        this.setState({ sendingData:true }, async () => {
            var formData = new FormData()
            formData.append('comment', this.state.comment);
            formData.append('subject', this.state.subject);
            formData.append('commented_by', this.state.loginData.id);
            let response = await APICALL('message/contactus/', 'POST', formData)
            console.log('dattttaa' + JSON.stringify(formData))
            if (response.status === 'success') {
                showToast(response.message)
                console.log('dattttaa 1546' + JSON.stringify(formData))
                this.setState({ sendingData:false })
            } else {
                showToast(response.message, 'error')
                this.setState({ sendingData:false })
            }
        })        
    }
    getContactusDetails = async () => {
        let response = await APICALL('pages/contactus/', 'GET')
        this.setState({ loading: false })
        if (response.status === 'success') {
            if (response.data) {
                this.setState({ terms_condition: response.data.content })
            }
        } else {
            let message = 'Something went wrong'
            if (response.message !== undefined) {
                message = response.message
            }
            showToast(message, 'error')
        }
    }

    render() {
        const { isReady, loading, terms_condition, privacy, subject, comment, addingComment } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Header
                    backButton={true}
                />
                {
                    loading || !isReady ?
                        <LoadingView />
                        :
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                            {/* <View style={styles.modalView}>
                                <View style={styles.popupContent}>
                                    <Text style={styles.popupContentText}>{terms_condition}</Text>
                                </View>
                            </View> */}
                            <View style={styles.commentBoxView}>
                                <TextInput
                                    placeholder="Subject"
                                    placeholderTextColor='#fff'
                                    style={styles.commentInputStyle}
                                    value={subject}
                                    onChangeText={(subject) => this.setState({ subject })}
                                />
                                <TextInput
                                    placeholder="Comment"
                                    placeholderTextColor='#fff'
                                    style={[styles.commentInputStyle, { height: 100, marginTop: 30, textAlignVertical: 'top' }]}
                                    value={comment}
                                    onChangeText={(comment) => this.setState({ comment })}
                                />
                                {
                                    !this.state.sendingData ?
                                        <TouchableOpacity onPress={() => this.sendData()}>
                                            <Image style={styles.downloadImg} source={require('../../assets/images/download.png')}></Image>
                                        </TouchableOpacity>
                                        :
                                        <View style={styles.addCommentLoaderStyle}>
                                            <ActivityIndicator size={30} color="#00b050" />
                                        </View>
                                }
                            </View>
                        </ScrollView>
                }
            </SafeAreaView>
        );
    }
}