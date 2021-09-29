import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, Image, SectionList, FlatList, Button } from 'react-native';
import { styles } from './styles';
import { Header } from '../../components'
import AsyncStorage from '@react-native-community/async-storage';
import { APICALL } from '../../common/ApiCaller';

const scheduled_maintanance_list = [
    { title: 'Check tire pressure', active: 'green' },
    { title: 'Check tire wear', active: 'green' },
    { title: 'Perform dynamic wheel balancing', active: 'green' },
    { title: 'Check engine oil', active: 'green' },
    { title: 'Check brake calipers', active: 'green' },
    { title: 'Check motor mounts', active: 'green' },
    { title: 'Check wheel bearings', active: 'green' },
    { title: 'Check rear sprocket & chain', active: 'green' }
]


export default class ScheduledMaintenanceScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            totTime: 'green'
        }
    }

    componentDidMount = async () => {
       // let response = await APICALL(`erallye/mytrip/${this.state.user_id}`, 'GET')
       const value = await AsyncStorage.getItem('loginData');
       this.setState({ user_id: JSON.parse(value).id})
       
       this.timeSchedule();

    }

    timeSchedule = async () => {
        let response = await APICALL(`erallye/mytrip/${this.state.user_id}`, 'GET')
                var start = response.data[0].start_datetime;
                var end = response.data[0].end_datetime;

                var startVal = start.split(' ')
                var nend = startVal[0] + "T" + startVal[1];

                var endVal = end.split(' ')
                var eeVal = endVal[0] + "T" + endVal[1];

                var dt1 = new Date(nend)
                var dt2 = new Date(eeVal)
                //"2021-08-12T20:10:23"
                var dt3 = (dt2.getHours() - dt1.getHours());
               
                console.log('dt1 ==>'+ dt1)
                console.log('dt2 ==>'+ dt2)
                console.log('dt3 ==>'+ dt3)
                timeDiff = dt3
                console.log('time diff'+ JSON.stringify(timeDiff))
                
                if(timeDiff > 4){
                    this.setState({totTime: timeDiff},() =>{
                        console.log('tot ==>'+ timeDiff)
                    })
                }
    }
    renderMaintenaceItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.bikeParts} 
            // onPress={this.goToScheduleMaintain(item.title)}
            >
                <View style={{ backgroundColor: this.state.totTime == 'green' ? 'green' : 'red', width: 16, height: 16, borderRadius: 20}}></View>
                <Text style={{ paddingLeft: 10, color: '#ffff', fontSize: 16}}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        // const title = this.props.navigation.state.params.value;
        // console.log('route data:' + JSON.stringify(this.props.navigation.state.params.title));
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#595959', justifyContent: 'center' }}>
                <Header backButton={true} />
                <View style={styles.main_container}>
                    {/* <View style={styles.horizontalLine}></View> */}
                    <View style={styles.health_risk}>
                        <Image style={styles.icons} source={require('../../assets/images/tools.png')} />
                        <Text style={styles.health_risk_text}>Scheduled Maintenance</Text>
                    </View>
                    <Image style={styles.bikeImg} source={require('../../assets/images/bike.png')} />
                    <ScrollView contentContainerStyle={styles.scrolled_container}>

                        <FlatList
                            style={styles.maintanace_List}
                            data={scheduled_maintanance_list}
                            renderItem={this.renderMaintenaceItem}
                            keyExtractor={item => item.id}
                            ItemSeparatorComponent={() => <View style={styles.separator}
                            />}
                        />
                    </ScrollView>

                    {/* <View style={styles.health_risk_view}>
                        <View style={styles.bikeParts} onPress={this.goToScheduleMaintain}>
                            <View style={{ backgroundColor: 'red', width: '10%' }}></View>
                            <Text style={{ paddingLeft: 10, color: '#ffff' }}>home</Text>
                        </View>

                        <Text style={styles.title_text}>Symptoms:</Text>
                        <View style={styles.parts_info}>
                            <Text style={styles.subText}>Headache Blurred vision Numbness in hands and Delayed reaction times</Text>
                        </View>

                    </View> */}
                </View>
            </SafeAreaView>
        )
    }
}