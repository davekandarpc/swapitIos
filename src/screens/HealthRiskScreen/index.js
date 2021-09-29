import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, Image, SectionList, FlatList, Button } from 'react-native';
import { styles } from './styles';
import { Header } from '../../components';
import { APICALL } from '../../common/ApiCaller';
import AsyncStorage from '@react-native-community/async-storage';

const health_risk_list = [
    { partsText: 'Headache' },
    { partsText: 'Blurred vision' },
    { partsText: 'Numbness in hands and feet' },
    { partsText: 'Delayed reaction times' },
]

export default class HealthRiskScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            title: 'Exposure to elevated levels of vibration',
            totTime: 'green'
        }
    }

    componentDidMount = async () => {
        const value = await AsyncStorage.getItem('loginData');
        this.setState({ user_id: JSON.parse(value).id })

        this.timeSchedule()
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
        //"2021-08-12T22:10:23"
        var dt3 = (dt2.getHours() - dt1.getHours());

        console.log('dt1 ==>' + dt1)
        console.log('dt2 ==>' + dt2)
        console.log('dt3 ==>' + dt3)
        timeDiff = dt3
        console.log('time diff' + JSON.stringify(timeDiff))

        if (timeDiff > 4) {
            this.setState({ totTime: timeDiff }, () => {
                console.log('tot ==>' + timeDiff)
            })
        }
    }

    renderMaintenaceItem = ({ item }) => {
        return (
            <View>
                <Text style={styles.subText}> -  {item.partsText}</Text>
            </View>

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
                        <Image style={styles.icons} source={require('../../assets/images/trophy.png')} />
                        <Text style={styles.health_risk_text}>Health & Safety Risks</Text>
                    </View>
                    <Image style={styles.bikeImg} source={require('../../assets/images/bike.png')} />

                    <View style={styles.health_risk_view}>
                        <View style={styles.bikeParts} onPress={this.goToScheduleMaintain}>
                            <View style={{ backgroundColor: this.state.totTime == 'green' ? 'green' : 'red', width: 16, height: 16, borderRadius: 20 }}></View>
                            <Text style={styles.title}>{this.state.title}</Text>
                        </View>

                        <Text style={styles.title_text}>Symptoms:</Text>
                        <View style={styles.parts_info}>
                            <FlatList
                                data={health_risk_list}
                                renderItem={this.renderMaintenaceItem}
                                keyExtractor={item => item.id}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />


                        </View>

                    </View>
                </View>
            </SafeAreaView>
        )
    }
}