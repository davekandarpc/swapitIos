import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
export const styles = StyleSheet.create({
    scrlView_container: {
        flexGrow: 1, 
        paddingBottom: 150
    },
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
    },
    ImageContainer: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#595959',
        alignSelf: 'center',
        marginTop: 30,
        // height: width * 3 / 4,
        // borderRadius: 8,
    },
    imageContainerContentStyle: {
        alignItems: 'center'
    },
    uploadImageStyle: {
        width: width,
        height: width * 3 / 4,
        // borderRadius: 8,
        resizeMode: 'contain'
    },
    uplaodImageText: {
        fontSize: 16,
        color: '#939393'
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12
    },
    postTitleView: {
        backgroundColor: '#9e9e9e',
        alignSelf: 'center',
        width: '70%',
        padding: 8
    },
    postTitleStyle: {
        textAlign: 'center',
        color: '#595959',
        fontSize: 14
    },
    locationView: {
        marginVertical: 15,
        height: 200
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    addCommentButtonStyle: {
        alignSelf: 'center'
    },
    commentBoxView: {
        // flexDirection: 'row',
        alignSelf: 'center',
        height: 40,
        alignItems: 'center',
        width: width - 40
    },
    commentInputStyle: {
        padding: 10,
        height: 60,
        backgroundColor: '#9e9e9e',
        width: '80%',
        color: '#fff',
        textAlignVertical: 'top'
    },
    commentButtonStyle: {
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#d9d9d9',
        elevation:9,
        borderRadius:3,
        paddingHorizontal:30,
        paddingVertical:10
    },
    commentButtonTextStyle: {
        textAlign: 'center'
    },
    addCommentLoaderStyle: {
        height: 40,
        marginLeft: 5,
        width: 48
    },
    addCommentIconStyle: {
        height: 45,
        width: 45,
        resizeMode: 'contain'
    },
    commentsContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center'
    },
    commenterImageStyle: {
        height: 30,
        width: 30,
        borderRadius: 30,
        backgroundColor: '#9e9e9e',
    },
    commentData: {
        marginLeft: 10,
        flex: 1
    },
    commentedByStyle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    },
    commentStyle: {
        color: '#fff',
        fontSize: 14,
    },
    commentDateStyle: {
        alignSelf: 'center'
    },
    commentDateTextStyle: {
        color: '#fff',
        fontSize: 12,
    },
    noTextViewStyle: {
        marginBottom: 10,
        marginHorizontal: 20
    },
    noDataTextStyle: {
        color: '#d9d9d9',
        fontSize: 16,
    },
    distanceDetails: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginTop: 12,
        alignItems: 'center'
    },
    distanceIcon: {
        marginRight: 10
    },
    distanceView: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#7f7f7f',
        marginRight: 5,
        marginBottom: 5
    },
    distanceViewTextStyle: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
    mailButton: {
        marginLeft: 5
    },
    locationIconStyle: {
        height: 45,
        width: 45,
        resizeMode: 'contain'
    },
    mailIconStyle: {
        height: 48,
        width: 48,
        resizeMode: 'contain'
    }
})