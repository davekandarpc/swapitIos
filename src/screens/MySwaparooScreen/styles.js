import { StyleSheet, Dimensions } from 'react-native';
export const styles = StyleSheet.create({
    scrlView_container: {
        flexGrow: 1,
        paddingTop: 50,
        paddingHorizontal: 24,
        paddingBottom: 20
    },
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
    },
    postItemView: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#bfbfbf',
        marginTop: 10
    },
    itemImageStyle: {
        height: 50,
        width: 100,
        backgroundColor: '#8f8f8f',
        resizeMode: 'contain'
    },
    noImageViewStyle: {
        height: 50,
        width: 100,
        backgroundColor: '#8f8f8f',
        justifyContent: 'center',
        alignItems: 'center'
    },
    postItemButtonsView: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    postItemButtonStyle: {
        marginLeft: 8,
    },
    iconStyle: {
        height: 35,
        width: 35,
        resizeMode: 'contain'
    }
})