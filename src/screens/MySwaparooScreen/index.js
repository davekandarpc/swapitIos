import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, View, Image, Text, InteractionManager, Pressable, TextInput } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView, Loader } from '../../components'
import AsyncStorage from '@react-native-community/async-storage';
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'
import { commonStyles } from '../../common/commonStyles'
import { NavigationEvents } from 'react-navigation';

export default class MySwaparooScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            mySwaparooData: [],
            loginData: null,
            loading: true,
            callingAPI: false
        }
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
                    this.getMySwaparoo()
                })
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    getMySwaparoo = () => {
        const { loginData } = this.state
        this.setState({ loading: true }, async () => {
            let response = await APICALL(`posts/myposts/${loginData.id}`, 'GET')
            console.log('My Posts: ' + JSON.stringify(response))
            this.setState({ loading: false })
            if (response.status === 'success') {
                if (response.data) {
                    this.setState({ mySwaparooData: response.data })
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

    editSwaparoo = (item) => {
        this.props.navigation.navigate('UploadScreen', { postData: item })
    }

    deleteSwaparoo = async (postId, index) => {
        this.setState({ callingAPI: true }, async () => {
            let response = await APICALL(`posts/${postId}`, 'DELETE')
            if (response.status === 'success') {
                let mySwaparooData = this.state.mySwaparooData;
                mySwaparooData.splice(index, 1)
                this.setState({ callingAPI: false, mySwaparooData })
                showToast(response.message)
            } else {
                showToast(response.message, 'error')
                this.setState({ callingAPI: false })
            }
        })
    }

    repost = (postId) => {
        this.setState({ loading: true }, async () => {
            let response = await APICALL(`posts/repost/${postId}`, 'POST')
            console.log('repost: ' + JSON.stringify(response))
            this.setState({ loading: false })
            if (response.status === 'success') {
                showToast(response.message)
            } else {
                let message = 'Something went wrong'
                if (response.message !== undefined) {
                    message = response.message
                }
                showToast(message, 'error')
            }
        })
    }

    imageLoadError = (index) => {
        let mySwaparooData = this.state.mySwaparooData;
        mySwaparooData[index].imgLoadError = true
        this.setState({ mySwaparooData })
    }

    render() {
        const { isReady, mySwaparooData, loading, callingAPI } = this.state
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
                                mySwaparooData.length !== 0 ?
                                    mySwaparooData.map((item, index) => {
                                        var date1 = new Date(item.posted_on.substring(0, 10));
                                        var date2 = new Date();
                                        var Difference_In_Time = date2.getTime() - date1.getTime();
                                        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                                        return (
                                            <View style={styles.postItemView} key={'key' + index}>
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
                                                <View style={styles.postItemButtonsView}>
                                                    <TouchableOpacity
                                                        style={styles.postItemButtonStyle}
                                                        onPress={() => this.editSwaparoo(item)}
                                                    >
                                                        <Image source={require('../../assets/images/edit.png')} style={styles.iconStyle} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.postItemButtonStyle, { flex: 1 }]}
                                                        onPress={() => {
                                                            if (Difference_In_Days > 30) {
                                                                this.repost(item.id)
                                                            } else {
                                                                alert('You cannot repost it now.')
                                                            }
                                                        }}
                                                    >
                                                        {
                                                            // Difference_In_Days > 23 &&
                                                            <Image source={require('../../assets/images/swap.png')} style={styles.iconStyle} />
                                                        }
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.postItemButtonStyle}
                                                        onPress={() => this.deleteSwaparoo(item.id, index)}
                                                    >
                                                        <Image source={require('../../assets/images/delete.png')} style={styles.iconStyle} />
                                                    </TouchableOpacity>
                                                </View>
                                                {/* <Text>{item.keywords}</Text> */}
                                            </View>
                                        )
                                    })
                                    :
                                    <View style={commonStyles.noTextViewStyle}>
                                        <Text style={commonStyles.noDataTextStyle}>No Posts found</Text>
                                    </View>
                            }
                        </ScrollView>
                }
                {/* {
                    isReady &&
                    <BottomButtons WithUploadButton={true} noSocilaMediaIcons={true} />
                } */}
            </SafeAreaView>
        );
    }
}