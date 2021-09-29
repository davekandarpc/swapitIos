import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding_horizontal = 16
export const styles = StyleSheet.create({
    scrlView_container: {
        flexGrow: 1,
        paddingTop: 100
    },
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
    },
    textInputStyle: {
        backgroundColor: '#a6a6a6',
        paddingHorizontal: 15,
        height: 40,
        color: '#fff',
        marginHorizontal: 48,
        marginTop: 10
    },
    submitButton: {
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#d9d9d9',
        elevation:9,
        borderRadius:3,
        paddingHorizontal:20,
        paddingVertical:10
    },
    submitButtonText: {
        color: '#000',
        fontSize: 16,
        lineHeight: 16,
        marginTop:3
    },
    resendButtonStyle: {
        marginTop: 20,
    },
    resendTextStyle: {
        color: '#d9d9d9',
        fontSize: 16,
        textAlign: 'center'
    },
})