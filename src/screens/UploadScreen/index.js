import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, Image, TextInput, InteractionManager, Pressable, PermissionsAndroid, ActivityIndicator, Platform } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { showToast } from '../../common/Toaster'
import { APICALL } from '../../common/ApiCaller'
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
Icon.loadFont();
Ionicons.loadFont();
Entypo.loadFont();
export default class UploadScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isReady: false,
            uploadedImage: '',
            latitude: 0,
            longitude: 0,
            keywords: '',
            imageBase64: '',
            uploading: false,
            ipAddress: '',
            loginData: null,
            editMode: true,
            editablePostData: null
        }
    }

    onLoad = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true,
                editMode: false,
                uploadedImage: '',
                imageBase64: '',
                keywords: ''
            }, () => {
                this.getLocationandIpAddress()
                this.getLoginData()
                let prevData = this.props.navigation.state.params
                if (prevData) {
                    let editablePostData = prevData.postData
                    let uploadedImage = {uri: editablePostData.image}
                    this.setState({ editablePostData: editablePostData, uploadedImage, keywords: editablePostData.keywords, editMode: true })
                }
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
                },
                (error) => { console.log(error.code, error.message) },
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
            );
        }
    }

    chooseFile = () => {
        var options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, response => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                let source = { uri: response.uri };
                const imageBase64 = 'data:image/jpeg;base64,' + response.data;
                this.setState({
                    uploadedImage: source,
                    imageBase64
                }, () => {
                });
            }
        });
    };

    cancelImage = () => {
        this.setState({ uploadedImage: '', imageBase64: '' })
    }

    uploadPost = () => {
        this.setState({ uploading: true }, async () => {
            const { keywords, imageBase64, latitude, longitude, loginData } = this.state
            
            var formData = new FormData()
            let posted_on = new Date().toString();
            formData.append('title', '');
            formData.append('category_id', global.selectedCategory);
            formData.append('keywords', keywords);
            formData.append('image', imageBase64);
            formData.append('posted_by', loginData.id);
            formData.append('posted_on', posted_on);
            formData.append('lat', latitude);
            formData.append('lng', longitude);
            formData.append('status', 'active');
            formData.append('userid', loginData.id);

            let response = await APICALL('posts/', 'POST', formData)
            if (response.status === 'success') {
                showToast(response.message)
                this.setState({ uploadedImage: '', imageBase64: '', keywords: '' })
            } else {
                let message = 'Something went wrong'
                if (response.message !== undefined) {
                    message = response.message
                }
                showToast(message, 'error')
            }
            this.setState({ uploading: false })
        })
    }

    updatePost = async () => {
        let postData = this.props.navigation.state.params.postData

        this.setState({ uploading: true }, async () => {
            const { keywords, imageBase64, latitude, longitude, loginData, uploadedImage, editablePostData } = this.state

            var formData = new FormData()
            let posted_on = new Date().toString();
            let updatedImage = ''
            if (imageBase64 !== '') {
                updatedImage = imageBase64
            }
            formData.append('title', '');
            formData.append('category_id', editablePostData.category_id);
            formData.append('keywords', keywords);
            formData.append('image', updatedImage);
            //formData.append('posted_by', loginData.id);
            //formData.append('posted_on', posted_on);
            formData.append('lat', latitude);
            formData.append('lng', longitude);
            //formData.append('status', 'active');
            //formData.append('userid', loginData.id);
            console.log('formdata: ', formData)
            let response = await APICALL(`posts/updatePosts/${editablePostData.id}`, 'POST', formData)
            if (response.status === 'success') {
                showToast(response.message)
                this.setState({ uploadedImage: '', imageBase64: '', keywords: '' })
                this.props.navigation.navigate('MySwaparooScreen')
            } else {
                let message = 'Something went wrong'
                if (response.message !== undefined) {
                    message = response.message
                }
                showToast(message, 'error')
            }
            this.setState({ uploading: false })
        })
    }

    render() {
        const { isReady, keywords, uploading, uploadedImage, editMode } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={payload => this.onLoad()}
                />
                <Header appTitle={'Myswaparoo'} backButton={true} />
                {
                    !isReady ?
                        <LoadingView />
                        :
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                            <Pressable onPress={this.chooseFile} style={styles.ImageContainer}>
                                {
                                    uploadedImage !== '' ?
                                        <Image
                                            source={uploadedImage}
                                            style={styles.uploadImageStyle}
                                        />
                                        :
                                        <View style={styles.imageContainerContentStyle}>
                                            <Icon name="cloud-upload" size={50} color="#939393" />
                                            <Text style={styles.uplaodImageText}>Upload Image</Text>
                                        </View>
                                }
                                {
                                    uploadedImage !== '' &&
                                    <Pressable style={styles.cancelImageStyle} onPress={this.cancelImage}>
                                        <Entypo name="cross" size={30} color="#939393" />
                                    </Pressable>
                                }
                            </Pressable>
                            <View style={styles.addKeywrodBoxStyle}>
                                <TextInput
                                    placeholder={"Enter description, comma separated"}
                                    placeholderTextColor="#595959"
                                    style={styles.textInputStyle}
                                    value={keywords}
                                    maxLength={30}
                                    onChangeText={(keywords) => this.setState({ keywords })}
                                />
                                <Pressable
                                    onPress={editMode ? this.updatePost : this.uploadPost}
                                    style={({ pressed }) => [
                                        {
                                            backgroundColor: pressed ? '#a6a6a6' : 'transparent'
                                        },
                                        styles.uploadButtonContainer
                                    ]}
                                >
                                    {
                                        !uploading ?
                                            <Ionicons name="cloud-upload-outline" size={30} color="#939393" />
                                            :
                                            <ActivityIndicator size={30} color="#00b050" />
                                    }
                                </Pressable>
                            </View>
                            {/* {
                                this.state.latitude !== 0 &&
                                <View style={styles.locationView}>
                                    <MapView
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: this.state.latitude,
                                            longitude: this.state.longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    >
                                        <Marker
                                            draggable
                                            coordinate={{
                                                latitude: this.state.latitude,
                                                longitude: this.state.longitude,
                                            }}
                                            title={'Your Location'}
                                            description={''}
                                        />
                                    </MapView>
                                </View>
                            } */}
                        </ScrollView>
                }
            </SafeAreaView>
        );
    }
}