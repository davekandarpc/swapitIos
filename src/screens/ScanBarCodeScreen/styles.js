import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding_horizontal = 16
export const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
        marginHorizontal: 40,
        justifyContent:'center',
        alignItems: 'center',
        marginBottom: 10
    },
    liketabcontainer:{
        // backgroundColor:'#a6a6a6',
        height:30,
        width:'85%',
        flexDirection:'row',
        borderRadius:10,
        paddingVertical:2
    },
    liketab:{
        backgroundColor:'#d9d9d9',
        height:28,
        flex:1,
        borderRadius: 6,
        // shadowColor: "#000000",
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // shadowOffset: {
        //   height: 1,
        //   width: 0
        // },
        justifyContent:'center',
        alignItems: 'center'
    },
    liketab_2:{
        height:28,
        flex:1,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
       justifyContent:'center',
       alignItems: 'center'
    },
    textStyles:{
        color:'#000',
        fontSize:16,
        textAlign:'center',
        justifyContent:'center',
        alignItems: 'center'
    },
    textStyles2:{
        color:'#8c8c8c',
        fontSize:14,
        textAlign:'center',
        justifyContent:'center',
        alignItems: 'center'
    },
    imageStyle:{
        height:200,
        width:200,
        resizeMode:'contain'
    },
    flagimageStyle:{
        height:50,
        width:50,
        resizeMode:'contain',
        justifyContent:'center',
        margin: 15
    },
    button: {
        backgroundColor: '#d9d9d9',
        padding:10,
        borderRadius:5,
        marginTop: 20
    
    },
    buttontrue: {
        backgroundColor: '#999999',
        padding:10,
        borderRadius:5,
        marginTop: 20
    },
    buttonText: {
        color: '#000',
        paddingHorizontal: 14
    },
    trophyView:{
        marginTop: 18,
        justifyContent: 'center',
        alignItems: 'center'
    },
    trophyText:{
        fontSize: 16,
        color: '#ffff'
    }
})