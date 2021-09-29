import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding_horizontal = 16
export const styles = StyleSheet.create({
    scrlView_container: {
        flexGrow: 1,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
    },
    homePageTitle: {
        color: '#d9d9d9',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10
    },
    homePageSubTitle:{
        color: '#d9d9d9',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontStyle:'italic',
    },
    categoriesView : {
        flex: 1,
        justifyContent: 'center'
    },
    categoriesListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    catrgoryItemStyle: {
        backgroundColor: '#d9d9d9',
        paddingVertical: 10,
        // paddingHorizontal: 15,
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
        backgroundColor: '#fff',
        // marginHorizontal: 20,
    },
    popupHeader: {
        marginHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#dedede',
        flexDirection: 'row',
        alignItems: 'center'
    },
    popupHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    popupContent: {
        padding: 16
    },
    popupContentText: {
        fontSize: 14,
    },
    horizontalLine: {
        borderBottomWidth: 1.5,
        marginHorizontal: 40,
        marginTop: 20,
        borderBottomColor: '#d9d9d9'
    },
    bottomCategoryIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: 90,
        height: 90,
        resizeMode: 'contain'
    }

})