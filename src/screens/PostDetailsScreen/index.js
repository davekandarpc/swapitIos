import React, { Component } from 'react';
import { Dimensions, Text, ScrollView, View, Image, Linking, ActivityIndicator, TextInput, InteractionManager, Pressable, SafeAreaView, PermissionsAndroid } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import MapView, { Marker } from 'react-native-maps';
import { showToast } from '../../common/Toaster'
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import AutoHeightImage from 'react-native-auto-height-image';
const WIDTH = Dimensions.get('window').width

export default class PostDetailsScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isReady: false,
            loading: true,
            postDetails: null,
            loading: false,
            ipAddress: '',
            showCommentBox: false,
            comment: '',
            addingComment: '',
            postComments: [],
            latitude: 0,
            longitude: 0,
            distanceinKm: 0,
            distanceInMiles: 0,
            subject: '',
            message: '',
            showMessageBox: false,
            sendingMessage: false,
            loginData: null,
            isYourPost: false
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true
            }, () => {
                this.getLoginData()
                this.getLocationandIpAddress()
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

    getLocationandIpAddress = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    'title': 'Location Access Required',
                    'message': 'This App needs to Access your location'
                }
                )
                if (granted) {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            this.setState({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            });
                            global.latitude = position.coords.latitude
                            global.longitude = position.coords.longitude
                            this.getPostDetails()
                            this.getPostComments()
                        },
                        (error) => { console.log(error.code, error.message) }
                    );
                } else {
                    alert("Permission Denied");
                }
            } catch (err) {
                alert("err", err);
                console.warn(err)
            }
        } else {
            Geolocation.requestAuthorization("whenInUse");
            Geolocation.getCurrentPosition(
                (position) => {
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    global.latitude = position.coords.latitude
                    global.longitude = position.coords.longitude
                    this.getPostDetails()
                    this.getPostComments()
                },
                (error) => { console.log(error.code, error.message) },
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
            );
        }
    }

    getPostDetails = () => {
        this.setState({ loading: true }, async () => {
            let post_id = this.props.navigation.state.params.post_id
            let response = await APICALL(`posts/${post_id}`, 'GET')
            console.log('post details" ', response + ', ' + post_id)

            if (response.status === 'success') {
                if (response.data) {
                    this.setState({ latitude: parseFloat(response.data.lat), longitude: parseFloat(response.data.lng) })
                    this.getDistanceOfSwap(global.latitude, global.longitude, response.data.lat, response.data.lng)
                    console.log('getPostDetails response: ', response)
                    this.setState({ postDetails: response.data })
                    if (this.state.loginData !== null) {
                        if (this.state.loginData.id === response.data.userid) {
                            this.setState({ isYourPost: true })
                        }
                    }
                }
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

    getDistanceOfSwap = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distanceinKm = R * c; // Distance in km

        let factor = 0.621371

        // calculate miles
        let distanceInMiles = distanceinKm * factor
        this.setState({ distanceinKm: distanceinKm.toFixed(1), distanceInMiles: distanceInMiles.toFixed(1) })

        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }
    }

    getPostComments = () => {
        this.setState({ loadingComments: true }, async () => {
            let post_id = this.props.navigation.state.params.post_id
            let response = await APICALL(`postcomment/${post_id}`, 'GET')
            console.log('comments: ', response)
            if (response.status === 'success' && response.data) {
                this.setState({ loading: false, postComments: response.data })
            }
        })
    }

    toggleCommenting = () => {
        const { showCommentBox } = this.state;
        this.setState({
            showCommentBox: !showCommentBox,
            comment: '',
            subject: '',
            addingComment: false
        })
    }

    toggleMessaging = () => {
        const { showMessageBox } = this.state;
        this.setState({
            showMessageBox: !showMessageBox,
            message: '',
            sendingMessage: false
        })
    }

    addComment = () => {
        this.setState({ addingComment: true }, async () => {
            let post_id = this.props.navigation.state.params.post_id
            let commented_on = new Date().toString();
            var formData = new FormData()
            formData.append('post_id', post_id);
            formData.append('comment', this.state.comment);
            formData.append('subject', this.state.subject);
            formData.append('commented_by', 'Me');
            formData.append('commented_on', commented_on);
            formData.append('status', 'status');

            let response = await APICALL('postcomment/', 'POST', formData)
            if (response.status === 'success') {
                showToast(response.message)
            } else {
                showToast(response.message, 'error')
            }
            this.toggleCommenting()
        })
    }

    replyMessage = async () => {
        const value = await AsyncStorage.getItem('loginData');
        if (value !== null) {
            this.setState({ loginData: JSON.parse(value) }, async () => {

                let post_id = this.props.navigation.state.params.post_id
                const { loginData, message, postDetails } = this.state
                this.setState({ sendingMessage: true })
                let commented_on = new Date().toString();
                let formData = new FormData;
                formData.append("post_id", post_id)
                formData.append("comment", message)
                formData.append("commented_by", loginData.id)
                formData.append("commented_on", commented_on)
                formData.append("status", "active")
                formData.append("subject", '')
                formData.append("commented_to", postDetails.userid)

                let response = await APICALL(`message/${loginData.id}`, 'POST', formData)
                console.log('response of add comment: ', response)
                this.setState({ sendingMessage: false, message: '', showMessageBox: false })
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
        } else {
            global.myNavigation.navigate('Login')
        }
    }

    mailPoster = () => {
        Linking.openURL(`mailto:${this.state.postDetails.email}`)
    }

    render() {
        const {
            subject, isReady, loading, postDetails, showCommentBox, comment, addingComment, postComments,
            latitude, longitude, message, showMessageBox, sendingMessage, isYourPost
        } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Header appTitle={'Myswaparoo'} backButton={true} />
                {
                    !isReady || loading ?
                        <LoadingView />
                        :
                        postDetails !== null &&
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                            <View style={styles.ImageContainer}>
                                <AutoHeightImage
                                    width={WIDTH}
                                    source={{ uri: postDetails.image }}
                                />
                            </View>
                            {
                                !showMessageBox &&
                                <View style={styles.titleContainer}>
                                    <View style={styles.postTitleView}>
                                        <Text style={styles.postTitleStyle}>{postDetails.keywords}</Text>
                                    </View>
                                    {
                                        !isYourPost &&
                                        <Pressable onPress={this.toggleMessaging} style={styles.mailButton}>
                                            <Image
                                                source={require('../../assets/images/message.png')}
                                                style={styles.mailIconStyle}
                                            />
                                        </Pressable>
                                    }
                                </View>
                            }
                            {
                                showMessageBox &&
                                <View style={styles.titleContainer}>
                                    <TextInput
                                        placeholder="Message the member"
                                        style={styles.commentInputStyle}
                                        value={message}
                                        onChangeText={(message) => this.setState({ message })}
                                    />
                                    {
                                        !sendingMessage ?
                                            <Pressable onPress={this.replyMessage} style={styles.mailButton}>
                                                <Image
                                                    source={require('../../assets/images/send.png')}
                                                    style={styles.mailIconStyle}
                                                />
                                            </Pressable>
                                            :
                                            <View style={styles.addCommentLoaderStyle}>
                                                <ActivityIndicator size={30} color="#00b050" />
                                            </View>
                                    }
                                </View>
                            }
                            {
                                <View style={styles.locationView}>
                                    <MapView
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: latitude,
                                            longitude: longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    >
                                        <Marker
                                            draggable
                                            coordinate={{
                                                latitude: latitude,
                                                longitude: longitude,
                                            }}
                                            title={'Your Location'}
                                            description={''}
                                        />
                                    </MapView>
                                </View>
                            }
                            {/* {
                                postComments.length !== 0 &&
                                postComments.map((item, index) => {
                                    let displayDate = ""
                                    if (item.comment !== "" && item.comment !== null) {
                                        var commentDateString = item.commented_on.substring(0, 10)
                                        var commentDateUTCString = new Date(commentDateString).toUTCString();
                                        var commentDateUTCSubString = commentDateUTCString.substring(5, 16);

                                        var commentTimeHours = item.commented_on.substring(11, 13);
                                        var commentTimeMins = item.commented_on.substring(14, 16);

                                        var timeFormat = commentTimeHours >= 12 ? 'PM' : 'AM';
                                        var displayTime = commentTimeHours + ':' + commentTimeMins + " " + timeFormat
                                        displayDate = commentDateUTCSubString + ' ' + displayTime
                                    }

                                    return (
                                        <View style={styles.commentsContainer} key={'comment' + index}>
                                            <View style={styles.commenterImageStyle}>
                                                <Image
                                                    source={item.image}
                                                    style={styles.commenterImageStyle}
                                                />
                                            </View>
                                            <View style={styles.commentData}>
                                                <Text style={styles.commentStyle}>{item.comment}</Text>
                                            </View>
                                            <View style={styles.commentDateStyle}>
                                                <Text style={styles.commentDateTextStyle}>{displayDate}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                                // :
                                // <View style={styles.noTextViewStyle}>
                                //     <Text style={styles.noDataTextStyle}>No comments</Text>
                                // </View>
                            } */}

                            <View style={styles.distanceDetails}>
                                <Pressable style={styles.distanceIcon}>
                                    <Image source={require('../../assets/images/location.png')} style={styles.locationIconStyle} />
                                </Pressable>
                                <View style={styles.distanceView}>
                                    <Text style={styles.distanceViewTextStyle}>mile / km</Text>
                                </View>
                                <View style={styles.distanceView}>
                                    <Text style={styles.distanceViewTextStyle}>{this.state.distanceInMiles} / {this.state.distanceinKm}</Text>
                                </View>
                            </View>

                            {/* <Text>My lat: {global.latitude}, My long: {global.longitude} </Text>
                            <Text>Post lat: {this.state.latitude}, Post long: {this.state.longitude} </Text> */}

                            {/* {
                                showCommentBox &&
                                    <View style={styles.commentBoxView}>
                                        <TextInput
                                            placeholder="Subject"
                                            style={styles.commentInputStyle}
                                            value={subject}
                                            onChangeText={(subject) => this.setState({ subject })}
                                        />
                                        <TextInput
                                            placeholder="Comment"
                                            style={styles.commentInputStyle}
                                            value={comment}
                                            onChangeText={(comment) => this.setState({ comment })}
                                        />
                                        {
                                            !addingComment ?
                                                <Pressable style={styles.commentButtonStyle} onPress={this.addComment}>
                                                    <Text style={styles.commentButtonTextStyle}>Send</Text>
                                                </Pressable>
                                                :
                                                <View style={styles.addCommentLoaderStyle}>
                                                    <ActivityIndicator size={30} color="#00b050" />
                                                </View>
                                        }
                                    </View>
                            } */}
                        </ScrollView>
                }
                <BottomButtons />
            </SafeAreaView>
        );
    }
}