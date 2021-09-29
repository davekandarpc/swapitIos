import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, Image, SectionList, FlatList, Button } from 'react-native';
import { styles } from './styles';
import { Header } from '../../components'
import AsyncStorage from '@react-native-community/async-storage';
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'

const scheduled_maintanance_list = [
    { title: 'Check tire', active: 'red' },
    { title: 'Check Breack wear', active: 'green' },
    { title: 'Perform dynamic wheel', active: 'green' },
    { title: 'Check wheel', active: 'red' },
    { title: 'Check motor', active: 'green' },
    { title: 'Check jump', active: 'green' },
    { title: 'Check headlight', active: 'green' }
]


export default class ScanBarCodeScreen_copy extends Component {
    scrollRef;
    constructor(props) {
        super(props)
        this.state = {
            user_id: null,
            isErally: true,
            isErally2: false,
            startBtn: false,
            loading: true,
            erallye_wallet: '',
            dealershipName: '',
            totalMile: null,
            startDate: null,
            endDate: null,
            sponsorData: [],
            dealership: null,
            dealership_value: null,
            dealershipName: null,
            dealershipID: null

        },
            this.scrollRef = React.createRef();
    }

    goToScanBarCodeScreen = (value) => {
        this.setState({
            startBtn: !value
        })
        this.props.navigation.navigate('LocationScreen')
    }

    componentDidMount = async () => {
        const value = await AsyncStorage.getItem('loginData');
        console.log('user id ==>', JSON.parse(value).id);
        this.eRellyValue(JSON.parse(value).id)

        this.setState({
            user_id: JSON.parse(value).id,
        })

        let responseMyTrip = await APICALL(`erallye/mytrip/${this.state.user_id}`, 'GET')

        let responseDealership = await APICALL(`erallye/dealership`, 'GET')

        this.setState({ 
            dealership: responseMyTrip.data, 
            dealership_value: responseDealership, 
            dealershipID: responseMyTrip.data[0].dealership_id}, () => {
            console.log('id =>'+ JSON.stringify(this.state.dealershipID))
        })

        var dealershipName = responseDealership;;
        for (let i = 0; i < responseDealership.data.length; i++) {
            for (let j = 0; j < responseDealership.data[i].child.length; j++) {
                if (responseDealership.data[i].child[j].id == responseMyTrip.data[0].dealership_id) {
                    dealershipName = responseDealership.data[i].child[j].name;
                    break;
                }
            }
        }

        var dealership_nameObject = {
            name: dealershipName
        }
        console.log('dealership name==>' + JSON.stringify(dealership_nameObject.name))

        this.setState({ dealershipName: dealership_nameObject.name })

        var id = this.state.dealershipID //40 // JSON.parse(value).id

        this.erallyeDealershipSponsor(id)
    }
    erallyeDealershipSponsor = async (dealer_id) => {
        let response = await APICALL(`erallye/dealership_sponsor/${dealer_id}`, 'GET')
        console.log('dealership id ==>'+ JSON.stringify(this.state.dealershipID))
        console.log('RESPONSE sposer: ' + JSON.stringify(response))

        if(response.data !== undefined) {
            this.setState({ sponsorData: response.data })
        }
    }
    eRellyValue = async (user_id) => {
        let response = await APICALL(`erallye/erallyewallet/${user_id}`, 'GET')
        console.log('RESPONSE: ' + JSON.stringify(response))
        this.setState({ erallye_wallet: response.data.erallye_wallet }) 
    }

    renderMaintenaceItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.bikeParts}
            // onPress={this.goToScheduleMaintain(item.title)}
            >
                <View style={{ backgroundColor: item.active == 'green' ? 'green' : 'red', width: '10%' }}></View>
                <Text style={{ paddingLeft: 10, color: '#ffff' }}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    // goToScheduleMaintain = ({ value }) => {
    //     console.log('title ==>'+ value)
    //     this.props.navigation.navigate('ScheduledMaintenanceScreen', {
    //         value: value
    //     });
    //     if(value !== undefined) {
    //         value = value;
    //         console.log('title ==>'+ value)
    //         this.props.navigation.navigate('ScheduledMaintenanceScreen', {
    //             value: value
    //         });
    //     }
    //     else{
    //         this.props.navigation.navigate('ScanBarCodeScreen_copy');
    //     }
    //     return value;

    // }

    goToScheduleMaintainScreen = () => {
        this.props.navigation.navigate('ScheduledMaintenanceScreen')
    }

    goToHealthRisksScreen = () => {
        this.props.navigation.navigate('HealthRiskScreen')
    }
    render() {
        const { open, value, items } = this.state;

        // const titlename = this.props.navigation.state.params.delershipTitle.name;
        const titlename = "San Jose Harley-Davidson";
        console.log('name ==>' + JSON.stringify(titlename))
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#595959', justifyContent: 'center' }}>
                <Header backButton={true} />
                <ScrollView contentContainerStyle={styles.scrolled_container}>
                    <View style={styles.main_container}>
                        {/* <View style={{ justifyContent: 'center', alignItems: 'center'}}> */}
                        <Image style={styles.flagimageStyle} source={require('../../assets/images/erally.png')} />
                        <View style={styles.liketabcontainer}>
                            <View style={styles.liketab}>
                                <Text style={styles.textStyles}>{this.state.erallye_wallet}</Text>
                            </View>
                            <View style={styles.liketab_2}>
                                <Text style={{ color: '#ffff', fontSize: 16 }}>eRallye Trophy</Text>
                            </View>
                        </View>
                        <View style={styles.trophyView}>
                            <Text style={styles.trophyText}>1 Trophy = USD $3.00</Text>
                        </View>
                        {/* </View> */}

                        {/* <View style={{ margin: 10 }}> */}
                        {/* <Image style={styles.imageStyle} source={require('../../assets/images/qrcode.png')} /> */}
                        {/* </View> */}
                        <TouchableOpacity style={this.state.startBtn ? styles.buttontrue : styles.button} onPress={() => this.goToScanBarCodeScreen(this.state.startBtn)} >
                            <Text style={styles.buttonText}>Start a New Trip</Text>
                        </TouchableOpacity>

                        {/* only view diawi */}
                        {this.state.dealershipName ?
                            <View style={{ width: '100%', marginTop: 10 }}>
                                <View style={styles.horizontalLine}></View>
                            </View>
                            :
                            <View></View>}

                        <View style={styles.scheduled_view}>
                            {this.state.dealershipName ?
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.delershipText}>{this.state.dealershipName}</Text>
                                    <Image style={styles.libreryImg} source={require('../../assets/images/Logo_Production.png')} />
                                </View>
                                : <View></View>
                            }

                            {this.state.sponsorData.length !== 0 ?
                                <View style={styles.salesView}>
                                    <Text style={styles.promotionsText}>In-Store Promotions</Text>
                                    {this.state.sponsorData.map((item, index) => {
                                        console.log('ITEMMM : ' + item)
                                        return (
                                            <View>
                                                <Text style={styles.milsText}>{item.promo_text}</Text>
                                            </View>
                                        )
                                    })
                                    }
                                </View>
                                : <View></View>}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}