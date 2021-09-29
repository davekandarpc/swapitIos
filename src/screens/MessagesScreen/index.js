import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, View, Image, Text, InteractionManager, Modal, TextInput } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView, Loader } from '../../components'
import AsyncStorage from '@react-native-community/async-storage';
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'
import { commonStyles } from '../../common/commonStyles'
import { NavigationEvents } from 'react-navigation';

export default class MessagesScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            message: '',
            messages: [],
            loginData: null,
            loading: true,
            callingAPI: false,
            replyModal: false,
            selectedMessage: null
        }
        this.deleteMessage = this.deleteMessage.bind(this);
        this.openReplyModal = this.openReplyModal.bind(this);
        this.closeReplyModal = this.closeReplyModal.bind(this);
    }

    componentDidMount = () => {
        this.onLoad()
    }

    onLoad = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true
            })
            this.getLoginData()
        });
    }

    getLoginData = async () => {
        try {
            const value = await AsyncStorage.getItem('loginData');
            if (value !== null) {
                this.setState({ loginData: JSON.parse(value) }, () => {
                    this.getMyMessages()
                })
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    getMyMessages = () => {
        const { loginData } = this.state
        this.setState({ loading: true }, async () => {
            let response = await APICALL(`message/${loginData.id}`, 'GET')
            this.setState({ loading: false })
            if (response.status === 'success') {
                if (response.data) {
                    this.markAllMessagesAsRead(response.data)
                    this.setState({ messages: response.data })
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

    deleteMessage = async (item, index) => {
        this.setState({ callingAPI: true }, async () => {
            let formData = new FormData;
            formData.append("id", item.messageid)
            let response = await APICALL(`message/deletemessage`, 'POST', formData)
            if (response.status === 'success') {
                let messages = this.state.messages;
                messages.splice(index, 1)
                this.setState({ callingAPI: false, messages })
                showToast(response.message)
            } else {
                showToast(response.message, 'error')
                this.setState({ callingAPI: false })
            }
        })
    }

    replyMessage = async () => {
        const { loginData, selectedMessage, message } = this.state
        console.log('message: ', message)
        this.setState({ replyModal: false, callingAPI: true })
        let commented_on = new Date().toString();
        let formData = new FormData;
        formData.append("post_id", selectedMessage.post_id)
        formData.append("comment", message)
        formData.append("commented_by", loginData.id)
        formData.append("commented_on", commented_on)
        formData.append("status", "active")
        formData.append("subject", '')
        formData.append("commented_to", selectedMessage.userid)

        let response = await APICALL(`message/${loginData.id}`, 'POST', formData)
        console.log('response of add comment: ', response)
        this.setState({ callingAPI: false })
        if (response.status === 'success') {
            showToast(response.message)
        } else {
            let message = 'Something went wrong'
            if (response.message !== undefined) {
                message = response.message
            }
            showToast(message, 'error')
        }
    }

    markAllMessagesAsRead = async (messages) => {
        let toBeMarkedAsRead = []
        messages.map((item, index) => {
            if (parseInt(item.is_read) === 0) {
                toBeMarkedAsRead.push(item.messageid)
            }
        })
        if (toBeMarkedAsRead.length !== 0) {
            let body = { "ids": toBeMarkedAsRead };
            await APICALL(`message/markasread/`, 'POST', body, true)
        }
    }

    imageLoadError = (index) => {
        let messages = this.state.messages;
        messages[index].imgLoadError = true
        this.setState({ messages })
    }

    openReplyModal = (item, index) => {
        const { replyModal } = this.state;
        this.setState({ replyModal: !replyModal, selectedMessage: item })
    }

    closeReplyModal = () => {
        const { replyModal } = this.state;
        this.setState({ replyModal: !replyModal })
    }

    render() {
        const { isReady, messages, loading, callingAPI, replyModal, selectedMessage, message } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={payload => this.onLoad()}
                />
                <Header
                    backButton={true}
                />
                {
                    callingAPI &&
                    <Loader />
                }
                {
                    !isReady || loading ?
                        <LoadingView />
                        :
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                            {
                                messages.length !== 0 ?
                                    messages.map((item, index) => {
                                        return (
                                            <View style={[styles.postItemView, item.is_read === 0 && { borderBottomColor: '#00b050' }]} key={'key' + index}>
                                                {
                                                    item.imgLoadError === undefined ?
                                                        <Image
                                                            source={{ uri: item.image }}
                                                            style={styles.itemImageStyle}
                                                            onError={() => this.imageLoadError(index)}
                                                        />
                                                        :
                                                        <View style={styles.noImageViewStyle}>
                                                            <Text style={{ color: '#bfbfbf' }}>Can't load</Text>
                                                        </View>
                                                }
                                                <View style={styles.rightContainer}>
                                                    <Text style={[styles.messageText, item.is_read === 0 && { fontWeight: 'bold' }]}>{item.comment}</Text>
                                                    <Text style={[styles.messageText, item.is_read === 0 && { fontWeight: 'bold' }]}>{item.commented_on}</Text>
                                                    <View style={styles.buttonsView}>
                                                        <TouchableOpacity onPress={() => this.deleteMessage(item, index)} style={styles.button}>
                                                            <Text style={styles.buttonText}>Delete</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => this.openReplyModal(item, index)} style={styles.button}>
                                                            <Text style={[styles.buttonText, { textAlign: 'right' }]}>Reply</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                    :
                                    <View style={commonStyles.noTextViewStyle}>
                                        <Text style={commonStyles.noDataTextStyle}>No Messages found</Text>
                                    </View>
                            }
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={replyModal}
                                onRequestClose={this.closeReplyModal}
                            >
                                {
                                    selectedMessage !== null &&
                                    <TouchableOpacity onPress={this.closeReplyModal} style={styles.modalMainContainer}>
                                        <View style={styles.replyBoxStyle}>
                                            <View style={styles.toUserDetails}>
                                                <Text style={styles.modaluserNameText}>To: {selectedMessage.commented_byname}</Text>
                                            </View>
                                            <TextInput
                                                multiline={true}
                                                placeholder="Message the member"
                                                style={styles.commentInputStyle}
                                                value={message}
                                                onChangeText={(message) => this.setState({ message })}
                                            />
                                            <View style={styles.modalButtons}>
                                                <TouchableOpacity onPress={this.closeReplyModal} style={styles.modalButton}>
                                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={this.replyMessage} style={styles.modalButton}>
                                                    <Text style={styles.modalButtonText}>Reply</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </Modal>
                        </ScrollView>
                }
            </SafeAreaView>
        );
    }
}