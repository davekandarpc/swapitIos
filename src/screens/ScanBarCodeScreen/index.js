import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, Image, SectionList } from 'react-native';
import { styles } from './styles';
import { Header, BottomButtons, LoadingView } from '../../components'
import AsyncStorage from '@react-native-community/async-storage';
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'

export default class ScanBarCodeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: null,
            isErally: true,
            isErally2: false,
            startBtn:false,
            loading: true,
            erallye_wallet: ''
        }
    }
    goToScanBarCodeScreen=(value)=>{
        this.setState({
            startBtn:!value
        })
        this.props.navigation.navigate('LocationScreen')
    }

    componentDidMount =async () => {
        const value = await AsyncStorage.getItem('loginData');
        console.log('user id ==>', JSON.parse(value).id); 
        this.eRellyValue(JSON.parse(value).id)
        
    }
    eRellyValue = async (user_id) => {
        let response = await APICALL(`erallye/erallyewallet/${user_id}`, 'GET')
        console.log('RESPONSE: ' + JSON.stringify(response))
        this.setState({erallye_wallet: response.data.erallye_wallet})
    }

    render() {
        const { open, value, items } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#595959', justifyContent: 'center'}}>
                <Header backButton={true} />
                <View style={styles.main_container}>
                    <View style={{  }}>
                        <Image style={styles.flagimageStyle} source={require('../../assets/images/erally.png')} />
                    </View>
                    <View style={styles.liketabcontainer}>
                            <View style={ styles.liketab }>
                                <Text style={styles.textStyles}>{this.state.erallye_wallet}</Text>
                            </View>
                            <View style={styles.liketab_2}>
                                <Text style={{ color: '#ffff', fontSize: 16 }}>eRallye Trophy</Text>
                            </View>
                    </View>
                    <View style={styles.trophyView}>
                        <Text style={styles.trophyText}>1 Trophy = USD $3.00</Text>
                    </View>
                    {/* <View style={{ margin: 10 }}> */}
                        {/* <Image style={styles.imageStyle} source={require('../../assets/images/qrcode.png')} /> */}
                    {/* </View> */}
                    <TouchableOpacity style={this.state.startBtn ? styles.buttontrue : styles.button} onPress={()=>this.goToScanBarCodeScreen(this.state.startBtn)} >
                        <Text style={ styles.buttonText}>Start a New Trip</Text>
                    </TouchableOpacity>
                </View>
                <Image />
            </SafeAreaView>
        )
    }
}