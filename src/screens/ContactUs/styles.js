import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding_horizontal = 16
export const styles = StyleSheet.create({
    scrlView_container: {
        flexGrow: 1,
    },
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
    },
    homePageTitle: {
        color: '#d9d9d9',
        fontSize: 16
    },
    categoriesListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    catrgoryItemStyle: {
        backgroundColor: '#d9d9d9',
        paddingVertical: 10,
        paddingHorizontal: 15,
        height: 90,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 8,
        marginVertical: 20,
    },
    selectedCatrgoryItemStyle: {
        backgroundColor: '#d9d9d9',
        borderColor: '#00b050',
        borderWidth: 3,
        paddingVertical: 10,
        paddingHorizontal: 15,
        height: 90,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 8,
        marginVertical: 20,
    },
    categoryIconStyle: {
        flex: 1,
        height: 90,
        width: 90, 
        resizeMode: 'contain'
    },
    catrgoryItemTextStyle: {
        color: '#939393',
        fontSize: 10
    },
    footer: {
        marginTop: 20,
        alignSelf: 'center',
        width: '100%'
    },
    termsConditionContainerStyle: {
        width: '80%',
        alignSelf: 'center',
    },
    termsStyle: {
        color: '#fff',
        textAlign: 'center'
    },
    termsLinkStyle: {
        marginBottom: 8,
    },
    termsLinkTextStyle: {
        color: '#0980CF',
        textAlign: 'center'
    },
    modalView: {
        // marginHorizontal: 20,
    },
    popupHeader: {
        paddingVertical: 16,
        alignSelf: 'flex-start'
    },
    popupHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 16,
        color: '#fff'
    },
    popupContent: {
        padding: 16
    },
    popupContentText: {
        fontSize: 14,
        color: '#fff'
    },

    commentBoxView: {
        // flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        width: width - 40,
        marginTop:100
    },
    commentInputStyle: {
        padding: 10,
        backgroundColor: '#9e9e9e',
        width: '100%',
        color: '#fff',
        textAlignVertical: 'center'
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
        width: 48,
        marginTop:10
    },
    addCommentIconStyle: {
        height: 45,
        width: 45,
        resizeMode: 'contain'
    },
    downloadImg:{
        height:60,
        width:40,
        resizeMode:'contain'
    }
})