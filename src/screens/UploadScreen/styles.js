import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding_horizontal = 16
export const styles = StyleSheet.create({
    scrlView_container: {
        flexGrow: 1
    },
    main_container: {
        flex: 1,
        backgroundColor: '#595959'
    },
    ImageContainer: {
        width: width - 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d9d9d9',
        alignSelf: 'center',
        marginTop: 30,
        height: 180,
        borderRadius: 8,
    },
    imageContainerContentStyle: {
        alignItems: 'center'
    },
    uploadImageStyle: {
        width: width - 48,
        height: 180,
        borderRadius: 8
    },
    uplaodImageText: {
        fontSize: 16,
        color: '#939393'
    },
    addKeywrodBoxStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: width - 48,
        alignItems: 'center',
        height: 40,
        marginTop: 20,
    },
    textInputStyle: {
        backgroundColor: '#a6a6a6',
        paddingHorizontal: 12,
        height: 40,
        color: '#fff',
        flex: 1
    },
    uploadButtonContainer: {
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 5,
        borderRadius: 4
    },
    cancelImageStyle: {
        backgroundColor: '#595959',
        position: 'absolute',
        top: 0,
        right: 0,
        borderWidth: 4,
        borderColor: '#9e9e9e',
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationView: {
        margin: 20,
        height: 200
    },
    map: {
        position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    },
})