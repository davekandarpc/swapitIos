import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding_horizontal = 16
export const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
        marginHorizontal: 40,
    },
    dropdwon: {
        height: 40,
        marginTop: 40,
        width: '100%',
        alignSelf: 'center',
        textAlign: 'center',
        zIndex:5001,
        backgroundColor: '#ffff'
        
    },
    dropdwonEnd: {
        flexDirection: 'row',
        marginTop: '8%',
        height: 35,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: '#d9d9d9',
        borderRadius: 3
    },
    horizontalLine: {
        borderBottomWidth: 1.5,
        marginTop: 20,
        borderBottomColor: '#d9d9d9'
    },
    trips: {
        marginTop: 18
    },
    button: {
        alignSelf: 'flex-start',
        backgroundColor: '#d9d9d9',
        borderColor: '#8bc34a',
        borderWidth: 0.5,
        elevation:9,
        borderRadius: 8,
        paddingHorizontal:20,
        paddingVertical:10,
    
    },
    buttontrue: {
        alignSelf: 'flex-start',
        backgroundColor: '#8bc34a',
        borderWidth: 0.5,
        elevation:9,
        borderRadius: 8,
        paddingHorizontal:20,
        paddingVertical:10
    },
    buttonText: {
        color: '#000',
        fontSize: 14,
        lineHeight: 16,
        textAlign: 'center'
    },
    accelerometerButton: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: '#d9d9d9',
        borderColor: '#0000FF',
        borderWidth: 0.5,
        elevation:9,
        borderRadius: 8,
        paddingHorizontal:20,
        paddingVertical:10,
        flexWrap: 'wrap',
        width: '45%',
        justifyContent: 'center'
    
    },
    saveToWalletButton: {
        alignSelf: 'center',
        backgroundColor: '#d9d9d9',
        // borderColor: '#0000FF',
        // borderWidth: 0.5,
        // elevation:9,
        borderRadius: 8,
        paddingHorizontal:20,
        paddingVertical:10,
        marginTop: 18,
    },
    directionRow: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    mapImg: {
        width: 40,
        height: 40,
        marginRight: 10,
        justifyContent: 'center'
    },
    separator:
    {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    tripsView: {
        backgroundColor: '#d9d9d9',
        marginTop: -2
    },
    textInput:{
        backgroundColor: '#d9d9d9', 
        height: 35,  
        alignItems: 'center',
        textAlign: 'center', 
        borderRadius: 5,
        flexDirection: 'row', 
        width: '100%', 
        justifyContent: 'space-between', 
        paddingHorizontal: 12,
        marginTop: 18
    },
    scheduled_view:{
        width: '100%',
        marginTop: 12,
        justifyContent:'center',
    },
    scheduled_text_view:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    },
    scheduled_text:{
        textAlign: 'center',
        color: '#ffff',
        fontSize: 16,
        margin: 6,
    },
    icons:{
        height: 32,
        width: 32,
        resizeMode: 'contain',
        justifyContent:'center',
        alignItems: 'center',
        margin: 6
    },
    verifyBtn: {
        alignSelf: 'center',
        backgroundColor: '#b4c7e7',
        borderRadius: 8,
        paddingHorizontal:20,
        paddingVertical:10,
        marginTop: 18,
    }
})    