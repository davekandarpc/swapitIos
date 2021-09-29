import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
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
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#bfbfbf',
        paddingVertical: 10,
        // alignItems: 'center'
    },
    itemImageStyle: {
        height: 100 * 3 / 4,
        width: 100,
        resizeMode: 'contain',
    },
    noImageViewStyle: {
        height: 50,
        width: 100,
        backgroundColor: '#8f8f8f',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightContainer: {
        flex: 1,
        marginLeft: 10
    },
    messageText: {
        color: '#fff'
    },
    buttonsView: {
        flexDirection: 'row',
        marginTop: 10
    },
    buttonText: {
        color: '#00b0f0'
    },
    modalMainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    replyBoxStyle: {
        backgroundColor: '#e6e6e6',
        width: width - 36,
        borderRadius: 4
    },
    toUserDetails: {
        backgroundColor :'#e6e6e6',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        padding: 10
    },
    modaluserNameText: {
        fontWeight: "bold",
        color: '#1b1c10'
    },
    commentInputStyle: {
        padding: 10,
        height: 60,
        borderColor: '#dddbdb',
        backgroundColor: '#dddbdb',
        borderWidth: 1,
        width: width - 56,
        color: '#000',
        textAlignVertical: 'top',
        alignSelf: 'center',
        borderRadius: 4
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 10
    },
    modalButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
    },
    modalButtonText: {
        textAlign: 'center',
        color: '#00b050'
    },
    button: {
        padding: 5,
        // borderColor: 'red',
        // borderWidth: 1,
        flex: 1
    }
})