import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, Image, Modal, InteractionManager, Pressable, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'

export default class CategorySelectionScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            selectedCategory: null,
            loading: true,
            isReady: false,
            termsPopup: false,
            privacyPopup: false,
            terms_condition: '',
            privacy: ''
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
            if(response.data) {
                this.setState({ categories: response.data })
            }
        } else {
            this.setState({ loading: false })
            let message = 'Something went wrong'
            if(response.message !== undefined) {
                message = response.message
            }
            showToast(message, 'error')
        }
    }

    selectCategory = (selectedCategory) => {
        this.setState({ selectedCategory })
        global.selectedCategory = selectedCategory;
        this.props.navigation.navigate('UploadScreen')
    }

    render() {
        const { isReady, loading, categories, selectedCategory, termsPopup, privacyPopup, terms_condition, privacy } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Header backButton={true} />
                {
                    loading || !isReady ?
                        <LoadingView />
                        :
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                             <View style={styles.categoriesView}>
                            <Text style={styles.homePageTitle}>Select Category </Text>
                            <View style={styles.categoriesListContainer}>
                                {
                                    categories.length !== 0 &&
                                    categories.map((item, index) => {
                                        return (
                                            <Pressable onPress={this.selectCategory.bind(this,item.id)} style={selectedCategory === index ? styles.selectedCatrgoryItemStyle : styles.catrgoryItemStyle} key={'category' + index}>
                                                <Image source={{ uri: item.image }} style={styles.categoryIconStyle} />
                                                <Text style={styles.catrgoryItemTextStyle}>{item.name}</Text>
                                            </Pressable>
                                        )
                                    })
                                }
                            </View>
                            </View>
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