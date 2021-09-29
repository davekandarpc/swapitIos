import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import SplashScreen from '../screens/SplashScreen';
import RegisterationScreen from '../screens/RegisterationScreen';
import Login from '../screens/Login';
import CodeVerificationScreen from '../screens/CodeVerificationScreen'
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import UploadScreen from '../screens/UploadScreen';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import MySwaparooScreen from '../screens/MySwaparooScreen';
import SubscriptionScreen from "../screens/SubscriptionScreen";
import TermsConditionScreen from '../screens/TermsConditionScreen'
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import ForgetScreen from '../screens/ForgetScreen';
import ContactUs from '../screens/ContactUs';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import MessagesScreen from "../screens/MessagesScreen";
import LocationScreen from "../screens/LocationScreen";
import ScanBarCodeScreen from "../screens/ScanBarCodeScreen";
import ScanBarCodeScreen_copy from "../screens/ScanBarCodeScreen_copy";
import ScheduledMaintenanceScreen from "../screens/ScheduledMaintenanceScreen";
import HealthRiskScreen from '../screens/HealthRiskScreen'

const navigationOptions = {
    headerShown: false
}
const Stack = createStackNavigator({
    SplashScreen: {
        screen: SplashScreen,
        navigationOptions
    },
    TermsConditionScreen: {
        screen: TermsConditionScreen,
        navigationOptions
    },
    PrivacyPolicyScreen: {
        screen: PrivacyPolicyScreen,
        navigationOptions
    },
    ContactUs: {
        screen: ContactUs,
        navigationOptions
    },
    MySwaparooScreen: {
        screen: MySwaparooScreen,
        navigationOptions
    },
    Login: {
        screen: Login,
        navigationOptions
    },
    RegisterationScreen: {
        screen: RegisterationScreen,
        navigationOptions
    },
    CodeVerificationScreen: {
        screen: CodeVerificationScreen,
        navigationOptions
    },
    HomeScreen: {
        screen: HomeScreen,
        navigationOptions
    },
    SearchScreen: {
        screen: SearchScreen,
        navigationOptions
    },
    UploadScreen: {
        screen: UploadScreen,
        navigationOptions
    },
    PostDetailsScreen: {
        screen: PostDetailsScreen,
        navigationOptions
    },
    SubscriptionScreen: {
        screen: SubscriptionScreen,
        navigationOptions
    },
    ForgetScreen: {
        screen: ForgetScreen,
        navigationOptions
    },
    CategorySelectionScreen: {
        screen: CategorySelectionScreen,
        navigationOptions
    },
    ResetPasswordScreen: {
        screen: ResetPasswordScreen,
        navigationOptions
    },
    MessagesScreen: {
        screen: MessagesScreen,
        navigationOptions
    },
    LocationScreen: {
        screen: LocationScreen,
        navigationOptions
    },
    ScanBarCodeScreen: {
        screen: ScanBarCodeScreen,
        navigationOptions
    },
    ScanBarCodeScreen_copy: {
        screen: ScanBarCodeScreen_copy,
        navigationOptions
    },
    ScheduledMaintenanceScreen: {
        screen: ScheduledMaintenanceScreen,
        navigationOptions
    },
    HealthRiskScreen: {
        screen: HealthRiskScreen,
        navigationOptions
    },
});

const SwitchNavigator = createSwitchNavigator(
    {
        Stack: Stack,
    },
    {
        initialRouteName: 'Stack'
    }
)

const AppContainer = createAppContainer(SwitchNavigator)
export default AppContainer