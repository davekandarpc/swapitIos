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
    horizontalLine: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#d9d9d9',
        width: '82%',
        marginTop: 10,
        marginHorizontal: 38,
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
        resizeMode: 'contain'
    },
    health_risk_view:{
        marginTop: 10,
        marginHorizontal: 40,
    },
    bikeParts: {
        width: '100%', 
        flexDirection: 'row',
        marginTop: 10
    },
    parts_info:{
        paddingTop: 6,
        marginLeft: '12%'
    },
    title:{
        paddingLeft: 10, 
        color: '#ffff',
        fontSize: 16
    },
    title_text:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        paddingLeft: '8%',
        paddingTop: 10
    },
    subText:{
        color: '#fff',
        fontSize: 16,
        width: '100%',
        paddingTop: 6
    }
})