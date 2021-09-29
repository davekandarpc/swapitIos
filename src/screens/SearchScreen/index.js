import React, { Component } from 'react';
import { SafeAreaView, Platform, Text, ScrollView, View, Image, TextInput, InteractionManager, Pressable, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import Geolocation from 'react-native-geolocation-service';
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'
import { commonStyles } from '../../common/commonStyles'
export default class SearchScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isReady: false,
            loading: true,
            latitude: '',
            longitude: '',
            keywords: '',
            loading: true,
            postData: [],
            filters: [
                { name: '50 / 80', value: 80 },
                { name: '250 / 402', value: 402 },
                { name: '500 / 804', value: 804 },
                { name: 'any', value: 0 },
            ],
            selectedFilter: null
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true
            }, () => {
                this.getLocation()
            })
        });
    }

    getLocation = async () => {
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
                            global.latitude = position.coords.latitude
                            global.longitude = position.coords.longitude
                            this.setState({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            }, () => {

                                this.getPosts()
                            });
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
                    console.log(position);
                    global.latitude = position.coords.latitude
                    global.longitude = position.coords.longitude
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }, () => {
                        this.getPosts()
                    });
                },
                (error) => {
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    }

    getPosts = async () => {
        this.setState({ loading: true }, async () => {
            const { keywords, latitude, longitude, selectedFilter } = this.state
            let kwd = keywords
            // kwd = 'test'
            let dist = selectedFilter
            // dist = 'active'

            var formData = new FormData()
            formData.append('category_id', global.selectedCategory);
            formData.append('user_lat', latitude);
            formData.append('user_lang', longitude);
            formData.append('dist', dist);
            formData.append('kwd', kwd);
            console.log(formData)

            let response = await APICALL('getposts', 'POST', formData)
            console.log('response: ', response)
            this.setState({ loading: false })
            if (response.status === 'success') {
                if (response.data) {
                    this.setState({ postData: response.data })
                }
            } else {
                let message = 'Something went wrong'
                if (response.message !== undefined) {
                    message = response.message
                }
                showToast(message, 'error')
            }
            console.log(JSON.stringify(this.state.postData))
        })
    }

    selectFilter = (selectedFilter) => {
        this.setState({ selectedFilter }, () => {
            this.getPosts()
        })
    }

    setSearchValue = (keywords) => {
        this.setState({ keywords })
    }

    goToDetailsScreen = (item) => {
        this.props.navigation.navigate('PostDetailsScreen', { post_id: item.id })
    }

    render() {
        const { isReady, keywords, postData, filters, selectedFilter, loading } = this.state
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#595959' }}>
                <Header appTitle={'Myswaparoo'} backButton={true} />
                <View style={styles.main_container}>
                    <View style={styles.filterContainerStyle}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, alignSelf: 'center' }}>
                            <Image source={require('../../assets/images/location.png')} style={styles.searchIcon} />
                            <Text style={styles.filterHeadingStyle}>Distance from my location</Text>
                        </View>
                        <View style={styles.filterView}>
                            <View style={styles.filterLabel}>
                                <Text style={styles.filterTextStyle}>mile / km</Text>
                            </View>
                            <View style={styles.filtersOptions}>
                                {
                                    filters.map((filter, index) => {
                                        return (
                                            <Pressable
                                                key={'filter' + index}
                                                onPress={this.selectFilter.bind(this, filter.value)}
                                                style={[selectedFilter === filter.value ? styles.activeFilterItem : styles.filterItem]}
                                            >
                                                <Text style={styles.filterTextStyle}>{filter.name}</Text>
                                            </Pressable>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.searchByKeywordViewStyle}>
                        <TextInput
                            placeholderTextColor="#dedede"
                            style={styles.textInputStyle}
                            value={keywords}
                            onChangeText={(keywords) => this.setSearchValue(keywords)}
                        />
                        <Pressable style={styles.searchButtonStyle} onPress={this.getPosts}>
                            <Image source={require('../../assets/images/search.png')} style={styles.searchIcon} />
                        </Pressable>
                    </View>
                    {
                        !isReady || loading ?
                            <LoadingView />
                            :
                            <ScrollView contentContainerStyle={styles.scrlView_container} showsVerticalScrollIndicator={false}>
                                {
                                    postData.length !== 0 ?
                                        postData.map((item, index) => {
                                            return (
                                                <Pressable style={styles.postItemStyle} onPress={this.goToDetailsScreen.bind(this, item)} key={'post' + index}>
                                                    <Image
                                                        source={{ uri: item.image }}
                                                        style={styles.postItemImageStyle}
                                                    />
                                                    {/* <Text>{item.keywords}</Text> */}
                                                </Pressable>
                                            )
                                        })
                                        :
                                        <View style={commonStyles.noTextViewStyle}>
                                            <Text style={commonStyles.noDataTextStyle}>No Posts found</Text>
                                        </View>
                                }
                            </ScrollView>
                    }
                </View>
                {/* {
                    isReady &&
                    <BottomButtons WithUploadButton={true} />
                } */}
            </SafeAreaView>
        );
    }
}