import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, Image, Modal, InteractionManager, Pressable, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'

export default class TermsConditionScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            terms_condition: '',
            loading: ''
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true,
                loading: true
            }, () => {
                this.getTermsConditions()
            })
        });
    }

    getTermsConditions = async () => {
        let response = await APICALL('pages/terms_condition/', 'GET')
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
        const { isReady, loading, terms_condition, privacy } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Header backButton={true} />
                {
                    loading || !isReady ?
                        <LoadingView />
                        :
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                            <View style={styles.modalView}>
                                <View style={styles.popupContent}>
                                    <Text style={styles.popupContentText}>{terms_condition}</Text>
                                </View>
                            </View>
                        </ScrollView>
                }
            </SafeAreaView>
        );
    }
}