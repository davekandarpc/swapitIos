import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding_horizontal = 16
export const styles = StyleSheet.create({
    main_container: {
        backgroundColor: '#595959',
        marginHorizontal: 40,
        justifyContent:'center',
        alignItems: 'center',
        marginBottom: '18%'
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
    },
    horizontalLine: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#d9d9d9',
        marginTop: 10
    },
    scheduled_view:{
        width: '100%',
        marginTop: 6,
        justifyContent:'center',
        alignItems: 'center'
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
        margin: 8,
    },
    icons:{
        height: 35,
        width: 35,
        resizeMode: 'contain',
        justifyContent:'center',
        alignItems: 'center',
        margin: 8
    },
    scrolled_container:{
       flexGrow: 1,
       justifyContent:'center',
    },
    bikeImg:{
        width: '100%',
        height: '45%',
        resizeMode:'contain'
    },
    maintanace_List: {
        marginTop: 10
    },
    separator:
    {
        height: 2,
    },
    bikeParts: {
        width: '100%', 
        flexDirection: 'row',
        marginTop: 10
    },
    delershipText:{
        textAlign: 'center',
        marginTop: 10,
        color: '#ffff',
        fontSize: 14,
    },
    libreryImg:{
        height:100,
        width:100,
        resizeMode:'contain',
        justifyContent:'center',
        // tintColor: '#474747' // seno color karva no 6 ?  #474747 #000
    },
    salesView:{
        width: '100%',
        borderWidth: 1,
        borderColor: '#ffff',
        padding: 10
    },
    salesText: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        color: '#ffff'
    },
    milsText:{
        color: '#ffff',
        paddingTop: 6,
        fontSize: 12
    },
    promotionsText:{
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffff',
        fontSize: 14,
        paddingBottom: 6
    }
})