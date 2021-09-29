import { StyleSheet, Dimensions } from 'react-native';
export const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
        justifyContent: 'center',
        alignItems: 'center'
    },
    homePageTitle: {
        color: '#d9d9d9',
        fontSize: 16
    },
    headerLogoView: {
        height: 180,
        width: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerLogo: {
        height: 150,
        width: 150,
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appTitleTextView: {
        flexDirection: 'row'
    },
    greyText: {
        fontSize: 24,
        color: '#d9d8d4',
        fontStyle: 'italic'
    },
    greenText: {
        fontSize: 24,
        color: '#00b050',
        fontStyle: 'italic'
    },
    title:{
        fontSize: 18,
        textAlign: 'center',
        color: '#ffff'
    }
})