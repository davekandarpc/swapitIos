import { StyleSheet, Dimensions } from 'react-native';
export const styles = StyleSheet.create({
    scrlView_container: {
        flexGrow: 1,
        paddingTop: 100,
        // paddingHorizontal:50
    },
    main_container: {
        flex: 1,
        backgroundColor: '#595959',
    },
    textInputStyle: {
        backgroundColor: '#a6a6a6',
        paddingHorizontal: 15,
        height: 40,
        color: '#fff',
        marginHorizontal: 48,
        marginTop: 10
    },
    submitButton: {
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#d9d9d9',
        elevation:9,
        borderRadius:3,
        paddingHorizontal:20,
        paddingVertical:10
    },
    submitButtonText: {
        color: '#000',
        fontSize: 16,
        lineHeight: 16,
        marginTop:3
    },
    payButton: {
        //marginTop: 20,
        borderWidth:1,
        borderRadius:3,
        borderColor:'#fff',
        // width:60,
        flexDirection:'row',
        justifyContent:'center',
        paddingVertical:5,
        marginTop: 12,
        paddingHorizontal: 12
    },
    PayButtonText: {
        color: '#fff',
        fontSize: 18,
        
    },
    radiobtnMainContainer:{
        flexDirection:'row',
        //backgroundColor:'white',
        marginBottom: 12,
        paddingHorizontal:2
        
    },
    radioBtnStyle:{
        height:20,
        width:20,
        borderColor:'#fff',
        borderRadius:3,
        borderWidth:1,
        backgroundColor:'#00b050',
        marginTop:5,
        marginLeft:8
    },
    containerRadio:{
        flex:1,
        //backgroundColor:'yellow',
        alignItems:'center'
    },
    radioBtnTxtContainer:{
        flex:4,
        //backgroundColor:'green',
        paddingTop:2
    },
    radioBtnTxtStyle:{
        color:'#fff',
        fontSize:13
    },
    radioBtnTxtsubStyle:{
        color:'#fff',
        fontSize:13
    },
    applePaytextContainer:{
        //paddingLeft:5,
        justifyContent:'center'
    }
})