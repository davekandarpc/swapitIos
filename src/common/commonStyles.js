import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding_horizontal = 16
export const commonStyles = StyleSheet.create({
    noTextViewStyle: {
        marginTop: 20
    },
    noDataTextStyle: {
        color: '#d9d9d9',
        fontSize: 16
    }
})