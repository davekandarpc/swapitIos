import React, { Component } from 'react';
import {
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    InteractionManager,
    Platform
} from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'
FontAwesome.loadFont();
const PaymentRequest = require('react-native-payments').PaymentRequest;

const METHOD_DATA = [{
    supportedMethods: ['apple-pay'],
    //supportedMethods:"https://apple.com/apple-pay",
    data: {
        // merchantIdentifier: 'merchant.apple.test',
        // merchantIdentifier: 'merchant.com.commercescape.app.test',
        merchantIdentifier: 'merchant.com.commercescape.app',
        supportedNetworks: ['visa', 'mastercard', 'amex'],
        countryCode: 'US',
        currencyCode: 'USD'
    }
}];

const DETAILS = {
    id: 'basic-example',
    displayItems: [
        {
            label: 'Subscription',
            amount: { currency: 'USD', value: '0.50' }
        },

    ],
    shippingOptions: [{
        id: 'economy',
        label: 'Economy Shipping',
        amount: { currency: 'USD', value: '0.00' },
        detail: 'Arrives in 3-5 days' // `detail` is specific to React Native Payments
    }],
    total: {
        label: 'Subscription',
        amount: { currency: 'USD', value: '1.00' }
    }
};
const OPTIONS = {
    requestPayerName: true,
    requestPayerPhone: true,
    requestPayerEmail: true,
    requestShipping: true
};

export default class SubscriptionScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedPlan: 'Free',
            loginData: null
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true
            }, () => {
                this.getSubscriptionData()
                this.getLoginData()
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

    getSubscriptionData = async () => {
        try {
            const value = await AsyncStorage.getItem('userSubscriptionStatus');
            if (value === 'Yes') {
                this.setState({ selectedPlan: 'Annual' })
            } else {
                this.setState({ selectedPlan: 'Free' })
            }
        } catch (error) {

        }
    }

    onSelected = (selectedPlan) => {
        this.setState({ selectedPlan })
    }

    selectFreePlan = () => {
        this.saveSubscriptionStatus('No')
    }

    onApplePay = () => {
        //alert('Coming soon')
        if (Platform.OS == 'ios') {
            const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);

            paymentRequest.addEventListener('shippingaddresschange', e => {
                const updatedDetails = getUpdatedDetailsForShippingAddress(paymentRequest.shippingAddress);

                e.updateWith(updatedDetails);
            });

            paymentRequest.addEventListener('shippingoptionchange', e => {
                const updatedDetails = getUpdatedDetailsForShippingOption(paymentRequest.shippingOption);

                e.updateWith(updatedDetails);
            });
            paymentRequest.canMakePayments().then((canMakePayment) => {
                if (canMakePayment) {
                    console.log('Can Make Payment IFF')
                    paymentRequest.show()
                        .then(paymentResponse => {
                            // Your payment processing code goes here

                            paymentResponse.complete('success');
                            console.log("success")
                            this.updateSubscriptionStatusToApi()
                        });
                }
                else {
                    console.log('Cant Make Payment Else')
                }
            })

        } else {
            console.log("android")
        }
    }

    updateSubscriptionStatusToApi = async () => {
        let { loginData } = this.state
        console.log('loginData: ' + JSON.stringify(loginData))
        let formData = new FormData
        formData.append('id', loginData.id)
        formData.append('membership', 'Yes')
        let response = await APICALL('membership', 'POST', formData)
        console.log('subscription api res: ', response)
        if (response.status === 'success') {
            this.saveSubscriptionStatus('Yes')
        }
    }

    saveSubscriptionStatus = async (value) => {
        try {
            await AsyncStorage.setItem('userSubscriptionStatus', `${value}`)
            global.userSubscriptionStatus = value;
            if (this.props.navigation.state.params) {
                if (this.props.navigation.state.params.goTo === 'PostSwap') {
                    if (global.isLoggedIn === undefined) {
                        // Not logged in
                        global.myNavigation.navigate('Login')
                    } else if (global.isLoggedIn === false) {
                        // Not logged in
                        global.myNavigation.navigate('Login')
                    } else {
                        // Logged in and subscribed
                        global.myNavigation.navigate('CategorySelectionScreen')
                    }
                } else if (this.props.navigation.state.params.goTo === 'HomeScreen') {
                    //If user comes just after registered..
                    global.myNavigation.navigate('HomeScreen')
                }
            }
        } catch (e) {
            // save error
        }
    }

    render() {
        const { isReady, selectedPlan } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Header backButton={true} />
                {
                    !isReady ?
                        <LoadingView />
                        :
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                            <View style={styles.radiobtnMainContainer}>
                                <View style={styles.containerRadio}>
                                    <TouchableOpacity style={[styles.radioBtnStyle, { backgroundColor: selectedPlan === 'Free' ? 'green' : 'transparent' }]} onPress={() => this.onSelected('Free')}>

                                    </TouchableOpacity>
                                </View>
                                <View style={styles.radioBtnTxtContainer}>
                                    <Text style={styles.radioBtnTxtStyle}>Free subscription</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Limited number of Swaps</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Secure communications between members</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Swaps end in 30 days</Text>
                                </View>
                            </View>
                            <View style={styles.radiobtnMainContainer}>
                                <View style={styles.containerRadio}>
                                    <TouchableOpacity style={[styles.radioBtnStyle, { backgroundColor: selectedPlan === 'Annual' ? 'green' : 'transparent' }]} onPress={() => this.onSelected('Annual')}>

                                    </TouchableOpacity>
                                </View>
                                <View style={styles.radioBtnTxtContainer}>
                                    <Text style={styles.radioBtnTxtStyle}>Upgrade to Annual Subscription $19USD</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Unlimited number of Swaps</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Secure communications between members</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   No time limit on Swaps</Text>
                                </View>
                            </View>
                            {
                                selectedPlan === 'Free' ?
                                    <TouchableOpacity style={styles.submitButton} onPress={this.selectFreePlan}>
                                        <Text style={styles.submitButtonText}>Submit</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={{ backgroundColor: 'transparent', alignSelf: 'center', flex: 1 }}>
                                        <TouchableOpacity style={styles.payButton} onPress={this.onApplePay}>
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <FontAwesome name="apple" size={15} color="#fff" style={{ paddingRight: 2 }} />
                                            </View>

                                            <View style={styles.applePaytextContainer}>
                                                <Text style={styles.PayButtonText}>Pay</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                            }
                        </ScrollView>
                }
                {/* {
                    isReady &&
                    <BottomButtons showBlankView={true} />
                } */}
            </SafeAreaView>
        )
    }

}