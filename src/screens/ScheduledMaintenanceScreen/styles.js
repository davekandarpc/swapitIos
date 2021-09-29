import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding_horizontal = 16
export const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
        marginTop: 10
    },
    subContainer: {
        marginHorizontal: 40,
    },
    horizontalLine: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#d9d9d9',
        width: '82%',
        marginTop: 10,
        marginHorizontal: 38
    },
    health_risk:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        marginHorizontal: 40,
    },
    icons:{
        height: 35,
        width: 35,
        resizeMode: 'contain',
        justifyContent:'center',
        alignItems: 'center',
        margin: 8
    },
    health_risk_text:{
        textAlign: 'center',
        color: '#ffff',
        fontSize: 16,
        margin: 8,
    },
    bikeImg:{
        width: '100%',
        height: '35%',
        resizeMode:'contain'
    },
    health_risk_view:{
        marginTop: 10
    },
    bikeParts: {
        width: '100%', 
        flexDirection: 'row',
        marginTop: 6
    },
    parts_info:{
        marginTop: 10,
        marginLeft: '20%'
    },
    title_text:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: '14%',
        marginTop: 10
    },
    subText:{
        color: '#fff',
        fontSize: 14,
        width: '40%'
    },
    scrolled_container:{
        flexGrow: 1,
        justifyContent:'center',
        marginHorizontal: 40,
     },
     maintanace_List: {
        marginTop: 10
    },
    separator:
    {
        height: 2,
    },
})