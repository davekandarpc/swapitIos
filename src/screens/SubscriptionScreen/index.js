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
import { showToast } from '../../common/Toaster';
import * as RNIap from 'react-native-iap';
import { purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';
FontAwesome.loadFont();
const PaymentRequest = require('react-native-payments').PaymentRequest;

// const PaymentRequest = require('react-native-payments').PaymentRequest;

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

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const itemSkus = ['com.myswaparooauto.product']

/*Platform.select({
    // ios: ['com.commercescape.sub'],
    // // android: ['nl.leadinglean.hetgesprek.allthemes']
    ios: [
        // 'com.myswaparooauto.product',
        //'com.commercescape.nonsconsumable',
        'commercescapeconsumable',
        // 'com.cooni.point5000', // dooboolab
      ],
    //   android: [
    //     'android.test.purchased',
    //     'android.test.canceled',
    //     'android.test.refunded',
    //     'android.test.item_unavailable',
    //     // 'point_1000', '5000_point', // dooboolab
    //   ],
});*/

export default class SubscriptionScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedPlan: '',
            loginData: null,
        }
    }

    componentDidMount = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isReady: true
            }, async () => {
                const result = await RNIap.initConnection();
                console.log('RNIP result: ', result)
                this.getLoginData()
            })
        });
    }

    subscribeIAP = () => {
        this.purchaseUpdateSubscription = purchaseUpdatedListener(async purchase => {
            if (purchase.transactionId !== "0") {
                // this.updateSubscriptionStatusToApi()
            }
        });
    }

    componentWillUnmount(): void {
        if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
        }
        RNIap.endConnection();
    }

    unsubscribeIAP = () => {
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }
    }

    requestSubscription = async (sku) => {
        try {
            // const result = await RNIap.initConnection();
            // console.log('RNIP result: ', result)
            console.log('item sku result: ', itemSkus)
            const products = await RNIap.getProducts(itemSkus);
            console.log('products: ', products)
            await RNIap.requestSubscription(itemSkus[0]);
        } catch (err) {
            console.log(err.code + ',' + err.message);
        }
    }

    getLoginData = async () => {
        try {
            const value = await AsyncStorage.getItem('loginData');
            if (value !== null) {
                console.log('login data', JSON.parse(value));
                this.setState({ loginData: JSON.parse(value) }, () => {
                    this.getSubscriptionData(this.state.loginData)
                })
            }
        } catch (error) {

        }
    }

    getSubscriptionData = async (loginData) => {
        let userId = loginData.id;
        let response = await APICALL(`membership/getdetails/${userId}`, 'GET');
        let membership = response.data.membership;
        if (membership === 'Yes') {
            this.setState({ selectedPlan: 'Annual', isSubscribed: true })
        } else {
            this.setState({ selectedPlan: 'Free' })
            purchaseUpdateSubscription = purchaseUpdatedListener(
                async (purchase: InAppPurchase | SubscriptionPurchase) => {
                    const value = await AsyncStorage.getItem('userSubscriptionStatus');
                    // if (value !== 'Yes') {
                        const receipt = purchase.transactionReceipt;
                        console.log('purchase : ', purchase)
                        if (!this.state.isSubscribed) {
                            if (receipt) {
                                this.updateSubscriptionStatusToApi()
                                this.setState({ isSubscribed: true })
                                alert('You are subscribed successfully')
                            }
                        } else {
                            // alert('you are already subscribed')
                        }
                    // }
                },
            );
        }
    }

    onSelected = (selectedPlan) => {
        this.setState({ selectedPlan })
    }

    selectFreePlan = () => {
        this.saveSubscriptionStatus('No')
    }

    onApplePay = async () => {
        // const getPurchaseHistory = await RNIap.getPurchaseHistory();
        // console.log('getPurchaseHistory: ', purchaseHistory)
        if (Platform.OS == 'ios') {
            if (!this.state.isSubscribed) {
                this.requestSubscription()
            } else {
                alert('You already have subscription')
            }

            // const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);

            // paymentRequest.addEventListener('shippingaddresschange', e => {
            //     const updatedDetails = getUpdatedDetailsForShippingAddress(paymentRequest.shippingAddress);

            //     e.updateWith(updatedDetails);
            // });

            // paymentRequest.addEventListener('shippingoptionchange', e => {
            //     const updatedDetails = getUpdatedDetailsForShippingOption(paymentRequest.shippingOption);

            //     e.updateWith(updatedDetails);
            // });
            // paymentRequest.canMakePayments().then((canMakePayment) => {
            //     if (canMakePayment) {
            //         console.log('Can Make Payment IFF')
            //         paymentRequest.show()
            //             .then(paymentResponse => {
            //                 // Your payment processing code goes here

            //                 paymentResponse.complete('success');
            //                 console.log("success")
            //                 this.updateSubscriptionStatusToApi()
            //             });
            //     }
            //     else {
            //         console.log('Cant Make Payment Else')
            //     }
            // })

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
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Unlimited number of Swaparoo’s</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Secure communications between members</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Swaparoo’s end in 30 days</Text>
                                </View>
                            </View>
                            <View style={styles.radiobtnMainContainer}>
                                <View style={styles.containerRadio}>
                                    <TouchableOpacity style={[styles.radioBtnStyle, { backgroundColor: selectedPlan === 'Annual' ? 'green' : 'transparent' }]} onPress={() => this.onSelected('Annual')}>

                                    </TouchableOpacity>
                                </View>
                                <View style={styles.radioBtnTxtContainer}>
                                    <Text style={styles.radioBtnTxtStyle}>Upgrade to Annual Subscription $18.99USD</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Unlimited number of Swaparoo’s</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   Secure communications between members</Text>
                                    <Text style={styles.radioBtnTxtsubStyle}>-   No time limit on Swaparoo’s</Text>
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
                                            <View style={styles.applePaytextContainer}>
                                                <Text style={styles.PayButtonText}>Submit</Text>
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