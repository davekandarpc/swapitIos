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
        paddingVertical: 10,
        paddingHorizontal: 24
    },
    filterContainerStyle: {
        marginTop: 30,
    },
    filterIconStyle: {
        position: 'absolute',
        top: -20,
        left: width / 2 - 10
    },
    filterHeadingStyle: {
        textAlign: 'center',
        color: '#d9d9d9',
        fontSize: 16,
        marginLeft: 10
    },
    filterView: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    filterLabel: {
        paddingVertical: 5,
        width: (width / 4)-40,
        backgroundColor: '#7f7f7f',
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterTextStyle: {
        color: '#fff',
        fontSize: 11,
        textAlign: 'center',
    },
    filtersOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1
    },
    filterItem: {
        paddingVertical: 5,
        width: (width / 4)-40,
        backgroundColor: '#7f7f7f',
        marginRight: 5,
        marginBottom: 5
    },
    activeFilterItem: {
        paddingVertical: 5,
        width: (width / 4)-40,
        backgroundColor: '#00b050',
        marginRight: 5,
        marginBottom: 5
    },
    postItemStyle: {
        // width: width - 24,
        height: 150,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#7f7f7f'
    },
    postItemImageStyle: {
        width: width - 32,
        height: 150,
        resizeMode: 'contain'
    },
    searchByKeywordViewStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
        // width: width - 32,
        alignItems: 'center',
        height: 40,
        marginTop: 20,
    },
    textInputStyle: {
        backgroundColor: '#a6a6a6',
        paddingHorizontal: 15,
        height: 40,
        color: '#fff',
        flex: 1
    },
    searchButtonStyle: {
        marginHorizontal: 10,
        // padding: 5,
        height: 40,
        borderRadius: 4,
        justifyContent: 'center'
    },
    searchButtonTextStyle: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    searchIcon: {
        height: 40,
        width: 40,
        resizeMode: 'contain'
    }
})