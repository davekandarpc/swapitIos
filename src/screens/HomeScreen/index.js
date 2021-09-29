import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, Image, Modal, InteractionManager, Pressable, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'

export default class HomeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            selectedCategory: null,
            loading: true,
            isReady: false,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true
            }, () => {
                this.getCategories()
            })
        });
    }

    getCategories = async () => {
        let response = await APICALL('categories', 'GET')
        if (response.status === 'success') {
            this.setState({ loading: false })
            if (response.data) {
                this.setState({ categories: response.data })
            }
        } else {
            this.setState({ loading: false })
            let message = 'Something went wrong'
            if (response.message !== undefined) {
                message = response.message
            }
            showToast(message, 'error')
        }
    }

    selectCategory = (selectedCategory) => {
        this.setState({ selectedCategory })
        global.selectedCategory = selectedCategory;
        this.props.navigation.navigate('SearchScreen')
    }

    goToLocationScreen = () => {
        this.props.navigation.navigate('LocationScreen')
    }
    render() {
        const { isReady, loading, categories, selectedCategory } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Header /* appTitle={global.settings[0].value} */ />
                {
                    loading || !isReady ?
                        <LoadingView />
                        :
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                            <View style={styles.categoriesView}>
                            <Text style={styles.homePageTitle}>Let’s make a Deal and Swap!</Text>
                            <Text style={styles.homePageSubTitle}>Take a picture, post it, and swap it</Text>
                                <View style={styles.categoriesListContainer}>
                                    {
                                        categories.length !== 0 &&
                                        categories.map((item, index) => {
                                            return (
                                                <Pressable onPress={this.selectCategory.bind(this, item.id)} style={selectedCategory === index ? styles.selectedCatrgoryItemStyle : styles.catrgoryItemStyle} key={'category' + index}>
                                                    <Image source={{ uri: item.image }} style={styles.categoryIconStyle} />
                                                    <Text style={styles.catrgoryItemTextStyle}>{item.name}</Text>
                                                </Pressable>
                                            )
                                        })
                                    }
                                </View>
                                <View style={styles.horizontalLine}></View>
                                <Text style={{textAlign: 'center', marginTop: 18, fontSize: 14, color: '#ffff'}}>eRallye Rewards Program</Text>
                                 <View style={styles.categoriesListContainer}>
                                    <Pressable style={styles.catrgoryItemStyle} onPress={this.goToLocationScreen}>
                                        <Image source={require('../../assets/images/erally.png')} style={styles.categoryIconStyle}/>
                                        <Text style={styles.catrgoryItemTextStyle}>eRallye</Text>
                                    </Pressable>
                                 </View>
                                   
                            </View>
                            
                            {/* <View style={styles.footer}>
                                <View style={styles.termsConditionContainerStyle}>
                                    <Pressable style={styles.termsLinkStyle} onPress={this.toggleTermsPopup}>
                                        <Text style={styles.termsLinkTextStyle}>Terms & Conditions</Text>
                                    </Pressable>
                                    <Pressable style={styles.termsLinkStyle} onPress={this.togglePrivacyPopup}>
                                        <Text style={styles.termsLinkTextStyle}>Privacy policy</Text>
                                    </Pressable>
                                    <Pressable style={styles.termsLinkStyle}>
                                        <Text style={styles.termsStyle}>{global.settings[7].value}</Text>
                                    </Pressable>
                                </View>
                            </View> */}
                        </ScrollView>
                }
                {/* {
                    !loading && isReady &&
                    <BottomButtons />
                } */}
            </SafeAreaView>
        );
    }
}