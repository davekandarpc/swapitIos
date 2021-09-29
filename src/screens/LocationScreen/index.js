import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, Image, SectionList, FlatList, Button, TextInput } from 'react-native';
import { styles } from './styles';
import { Header, DropDown, SectionDropDown, DropDown_dealership } from '../../components'
import DropDownPicker from 'react-native-dropdown-picker'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from "react-native-vector-icons/MaterialIcons";
import { APICALL } from '../../common/ApiCaller'
import { showToast } from '../../common/Toaster'
import AsyncStorage from '@react-native-community/async-storage';
import {
    accelerometer,
    gyroscope,
    setUpdateIntervalForType,
    SensorTypes
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import Geolocation from '@react-native-community/geolocation';

export default class LocationScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            modal_no: null,
            entity_id: null,
            start_datetime: null,
            end_datetime: null,
            address: null,
            distancetravelled: null,
            avgspeed: '',
            vin_no: null,
            dealership_id: null,
            loading: false,
            message: '',
            message_error: '',
            items: [],
            tripsItems: [],
            modelItems: [],
            selectedItems: null,
            selectedDealership: null,
            entity_modal: [],
            getTrips: [],
            selectAllItems: [],
            dealership: [],
            showTrips: false,
            startTrip: false,
            endTrip: false,
            downArror: false,
            sec: 0,
            distancepersec: 0,
            avgspeedfinal: 0,
            speed: 0,
            /*  */
            selectedMakeValue: null,
            selectedItemObjects: [],
            hasLocationPermission: null,
            /* location */
            latitude: null,
            longitude: null,
            endlat: null,
            endlong: null,
            distance: null,
            totTime: 0,
            totalDistance: 0,
            averageSpeed: 0,
            startlat: 0,
            startlog: 0,
            lastlat: 0,
            lastlog: 0,
            pervlat: 0,
            pervlog: 0,
            currentlat: 0,
            currentlog: 0,
            avgtotaltime: 0,
            avgtotaldistance: 0,
            startendTrip: 0,
            miles: 0,
            modalUser: null,
            vehicleId: null,
            verifyVehicle: []

        };
        this.subscription = null
    }

    componentDidMount = async () => {
        setUpdateIntervalForType(SensorTypes.accelerometer, 1000);
        const value = await AsyncStorage.getItem('loginData');

        console.log('user id ==>', JSON.parse(value).id);

        let response = await APICALL(`entity`, 'GET')
        let MakeArray = []
        for (let i = 0; i < response.data.length; i++) {
            var data = { label: `${response.data[i].name}`, value: `${response.data[i].id}` }
            MakeArray.push(data)
        }

        this.setState({
            items: MakeArray,
            user_id: JSON.parse(value).id,
        })

       

        let responseDealership = await APICALL(`erallye/dealership`, 'GET')

        this.setState({ dealership: responseDealership.data })

        // let dealershipArray = []
        // for (let i = 0; i < responseDealership.data[i].child[i].length; i++) {
        //     var dataDeal = { label: `${responseDealership.data[i].name}`, value: `${responseDealership.data[i].id}` }
        //     dealershipArray.push(dataDeal);
        // }
        //console.log('dealership Array' + JSON.stringify(responseDealership))

        let responseMyTrip = await APICALL(`erallye/mytrip/${this.state.user_id}`, 'GET')

        var modalValue = {
            label: responseMyTrip.data[0].parent_0.name
        }

        var dealValue = responseDealership;
        for (i = 0; i < responseDealership.data.length; i++) {
            for (j = 0; j < responseDealership.data[i].child.length; j++) {
                if (responseDealership.data[i].child[j].id === responseMyTrip.data[0].dealership_id) {
                    dealValue = responseDealership.data[i].child[j].name;
                    break;
                }
            }
        }

        var dealershipObject = {
            name: dealValue
        }
        this.setState({
            modal_no: responseMyTrip.data[0].modal_no,
            selectedMakeValue: modalValue,
            entity_id: responseMyTrip.data[0].entity_id,
            selectedItems: responseMyTrip.data[0].parent_2.name,
            dealership_id: responseMyTrip.data[0].dealership_id,
            selectedDealership: dealershipObject,
            vin_no: responseMyTrip.data[0].vin_no
        }, () => {
            console.log('deal select ' + JSON.stringify(this.state.selectedDealership))
        })

        let responseVerify = await APICALL(`erallye/myvehicle/${this.state.user_id}`, 'GET');
        console.log('verify vehicle ==>' + JSON.stringify(responseVerify)),
            console.log('verify vehicle id==>' + JSON.stringify(responseVerify.data.is_verified = "0"))

        this.setState({ vehicleId: responseVerify.data.is_verified = "0" })

    }

    calulateDistance = (speed) => {
        console.log("Speed : " + speed)
        var sec = this.state.sec
        sec += 1
        var distancepersec = sec * speed
        this.setState({ speed: speed.toFixed(2), sec, distancepersec: distancepersec.toFixed(2) }, () => {
            // console.log("Time : "+this.state.sec)
            console.log("speed : " + speed)
            // console.log("distancepersec : "+this.state.distancepersec)
        })
    }

    endTipCalculation = () => {
        var avgspeed = 0
        var time = this.state.sec
        var distance = this.state.distancepersec
        avgspeed = distance / time
        this.setState({ avgspeedfinal: avgspeed.toFixed(2) })
        this.location()
    }

    strtTipeState = (currentLat, currentLong, type) => {
        const { startlat, startlog, pervlat, pervlog, currentlat, currentlog, avgtotaltime, avgtotaldistance, endlat, endlong } = this.state
        var time = this.state.avgtotaltime
        var distance = 0
        if (type === 0) {
            time += 30
            console.log("Distace State 0: " + time)
            this.setState({
                pervlat: pervlat,
                pervlog: pervlog,
                currentlat: currentLat,
                currentlog: currentLong,
                avgtotaltime: time,
            }, () => {
                distance = this.getDistanceFromLatLonInKm(pervlat, pervlog, currentLat, currentLong)
                this.setState({
                    pervlat: currentLat,
                    pervlog: currentLong,
                })
                console.log("Distace State 0: " + distance)
            })
        } else if (type == 1) {
            this.setState({
                endlat: currentLat,
                endlong: currentLong,
                pervlat: pervlat,
                pervlog: pervlog,
                currentlat: currentLat,
                currentlog: currentLong,
                avgtotaltime: time,
            }, () => {
                this.setState({ startendTrip: 3 })
                distance = this.getDistanceFromLatLonInKm(pervlat, pervlog, currentLat, currentLong)
                console.log("Distace State 1: " + distance)
            })
        }
        var Totaldistance = this.state.avgtotaldistance + distance
        this.setState({ avgtotaldistance: Totaldistance }, () => {
            if (type === 1) {
                this.getDistance()
            }
        })
    }

    location = () => {
        console.log('location Call' + this.state.startendTrip)
        var currentLat = 0
        var currentLong = 0
        Geolocation.getCurrentPosition((loc) => {
            currentLat = loc.coords.latitude
            currentLong = loc.coords.longitude
            console.log('location currentLat 1 : ' + currentLat)
            console.log('location currentLong 1 : ' + currentLong)

            if (this.state.startendTrip == 0) {
                this.setState({
                    startlat: currentLat,
                    startlog: currentLong,
                    pervlat: currentLat,
                    pervlog: currentLong,
                    startendTrip: 1
                })
                this.startTimeSpeed()
            } else if (this.state.startendTrip == 1) {
                this.strtTipeState(currentLat, currentLong, 0)
                this.startTimeSpeed()
            } else if (this.state.startendTrip == 2) {
                this.strtTipeState(currentLat, currentLong, 1)
            }
        },
            error => console.log('Error', JSON.stringify(error)),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 0 }
        );

    }

    startTimeSpeed = () => {
        setTimeout(() => {
            this.location()
        }, 30000);
    }


    getDistance = () => {

        // var totalKmDistance = this.state.avgtotaldistance
        // var totMiles = this.state.avgtotaltime
        var totalKmDistance = this.state.avgtotaldistance
        var totMiles = totalKmDistance * 0.62137119224
        var avgTotalTime = (totMiles)
        // var avgTotalTime = (totalTime / 60).toString()

        // var avgTotalTime = totalKmDistance * 1.60
        var distance_into = (totalKmDistance * 100)
        // var time_devide = (totalTime) / 60
        var time_devide = totMiles
        var avgSpeed = (distance_into / time_devide) / 100

        this.setState({
            miles: avgTotalTime.toFixed(2),
            totalDistance: totalKmDistance.toFixed(2),

            averageSpeed: avgSpeed
        }, () => {
            console.log('avg : ' + this.state.averageSpeed.toFixed(2))
            console.log("miles : " + totMiles.toFixed(2))
            console.log("min : " + avgTotalTime)
            console.log("km : " + this.state.totalDistance)

            this.SaveToWalletapi()
        })


    }

    getDistanceFromLatLonInKm = (currentLat, currentLong, lat2, lon2) => {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - currentLat);  // this.deg2rad below
        var dLon = this.deg2rad(lon2 - currentLong);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(currentLat)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        // this.setState({ distance: d.toFixed(2) })
        console.log('distance', d)
        if (d > 0.01) {
            return d;
        } else {
            return 0;
        }

    }

    deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    }

    pad_zeros = (month, date, hours, min, sec) => {
        var month = (month < 10) ? ("0" + month) : month
        var date = (date < 10) ? ("0" + date) : date
        var hours = (hours < 10) ? ("0" + hours) : hours
        var min = (min < 10) ? ("0" + min) : min
        var sec = (sec < 10) ? ("0" + sec) : sec
        var allDate = `${month + '-' + date + ' ' + hours + ':' + min + ':' + sec}`;
        return allDate;
    }

    onStartTime = async (value) => {
        this.location()
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var hours = new Date().getHours();
        var min = new Date().getMinutes();
        var sec = new Date().getSeconds();
        var start = year + '-' + this.pad_zeros(month, date, hours, min, sec)
        await AsyncStorage.setItem('start_datetime', JSON.stringify(start))
        var date = await AsyncStorage.getItem('start_datetime')
        this.setState({ start_datetime: start, startTrip: !value })
        console.log('Start Datetime :==> ', this.state.start_datetime)
    }

    onEndTime = async (value) => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var hours = new Date().getHours();
        var min = new Date().getMinutes();
        var sec = new Date().getSeconds();
        var end = year + '-' + this.pad_zeros(month, date, hours, min, sec)
        await AsyncStorage.setItem('end_datetime', JSON.stringify(end))
        var date = await AsyncStorage.getItem('end_datetime')
        console.log('End Datetime :=> ', date)
        this.setState({ end_datetime: end, endTrip: !value, startendTrip: 2 }, () => {
            this.location()
        })
    }

    goToScanBarCodeScreen = () => {
        //this.props.navigation.navigate('ScanBarCodeScreen');
        this.props.navigation.navigate('ScanBarCodeScreen_copy', {
            delershipTitle: this.state.selectedDealership,

        })
    }

    dateTimeFormat = (value) => {
        var timeing = ''
        if (value == '0000-00-00 00:00:00') {
            timeing = '0000-00-00 00:00:00'
            return timeing
        } else {
            console.log("Vluaee : " + value)
            var nval = value.split(' ')
            var val = nval[0] + "T" + nval[1]
            //const months = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            var datetime = new Date(val) // 2021-08-11T05:25:21
            var getdate = datetime.getDate()
            var getmonth = months[datetime.getMonth()]
            var getyear = datetime.getFullYear()
            console.log('date === time ==>', datetime.getMonth())
            // var getyear = new Date().getFullYear();
            var getHour = datetime.getHours()
            var getmin = datetime.getMinutes()
            var hu = getHour >= 12 ? 'PM' : 'AM'
            console.log('current month' + getmonth)
            console.log('current year' + getyear)
            // timeing = getdate + ", " + getmonth + " " + getyear + " " + getHour + ":" + getmin + " " + hu
            timeing = getmonth + "/" + getdate + "/" + getyear
            return timeing
        }

        // console.log('getmonth : '+getmonth)
        // console.log('getyear : '+getyear)
        // console.log('getHour : '+getHour)
        // console.log('getmin : '+getmin)
    }

    renderTripText = ({ item, index }) => {
        var dt = this.dateTimeFormat(item.start_datetime)
        console.log("Startt Time DTT : " + dt)
        return (

            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', height: 40, justifyContent: 'space-between', paddingHorizontal: 10 }}>
                {/* <Text style={{ color: 'black', fontSize: 11, marginTop: 10 }}>{item.start_datetime}</Text> */}
                <Text style={{ color: 'black', fontSize: 11, marginTop: 10 }}>{dt} {item.total} min</Text>
                <Text style={{ color: 'black', fontSize: 11, marginTop: 10, width: 100, textAlign: 'center' }}>{item.parent_2 != undefined && item.parent_2.name}</Text>
                <View style={{ position: 'relative', right: 0, marginTop: 10, flexDirection: 'row' }}>
                    <Text style={{ color: 'black', fontSize: 11 }}>{item.avgspeed}m/</Text>
                    <Text style={{ color: 'black', fontSize: 11 }}>{item.distancetravelled}km</Text>
                </View>
            </View>
        )
    }

    SelectedMakeValue = async (item, modalNoId) => {

        console.log('modal no==>', modalNoId)

        this.setState({ selectedMakeValue: item, modal_no: modalNoId })
        let response = await APICALL(`entity/modal/${item.value}`, 'GET')
        console.log("new Modal value ===> " + JSON.stringify(response.data))
        //this.storeModalValue(item.label, modalNoId)
        this.setState({ entity_modal: response.data })

    }

    storeModalValue = async (value, valueId) => {
        try {
            await AsyncStorage.setItem('modalValue', value);
            await AsyncStorage.setItem('modalNoid', valueId);
        }
        catch (e) {
            console.log(error)
        }
        console.log('modal Id ==>' + JSON.stringify(valueId))
        console.log('modalValue ==>' + JSON.stringify(value))
    }



    SelectedModelValue = async (seleted, itemId) => {
        console.log('select item', seleted)
        console.log('entity id ==>', itemId)
        //.storeMakeValue(seleted, itemId)
        this.setState({ selectedItems: seleted, entity_id: itemId })
    }

    storeMakeValue = async (value, entityId) => {
        try {
            await AsyncStorage.setItem('entityID', entityId);
            await AsyncStorage.setItem('makeValue', value);
        }
        catch (e) {
            console.log(error)
        }
    }

    selectDealership = async (selectDealer, dealshipId) => {
        //this.storeDealership(item.label, dealshipId)
        console.log('select del' + JSON.stringify(selectDealer))

        const del = {
            name: selectDealer
        }
        this.setState({ selectedDealership: del, dealership_id: dealshipId },
            () => {
                console.log('select deal item ' + JSON.stringify(this.state.selectedDealership))
            })


    }

    storeDealership = async (value, dealershipID) => {
        try {
            await AsyncStorage.setItem('dealerShipID', dealershipID)
            await AsyncStorage.setItem('selectDealership', value)
        }
        catch (e) {

        }
        console.log('dealer' + JSON.stringify(dealershipID))

    }

    selectVinNo = (vinNo) => {
        this.storeVinno(vinNo)
        this.setState({ vin_no: vinNo })
    }

    storeVinno = async (value) => {
        try {
            await AsyncStorage.setItem('vinNo', value)
        }
        catch (e) {

        }
        console.log('vin ==>' + JSON.stringify(value))
    }

    SaveToWalletapi = async () => {

        const { user_id, modal_no, entity_id, start_datetime,
            end_datetime, address, miles, totalDistance, vin_no, dealership_id, totTime } = this.state
        console.log('user id', user_id);
        console.log('total ===> : ' + this.state.totalDistance)
        var formData = new FormData()
        formData.append('user_id', user_id);
        formData.append('modal_no', modal_no);
        formData.append('dealership_id', dealership_id)
        formData.append('entity_id', entity_id);
        formData.append('start_datetime', start_datetime);
        formData.append('end_datetime', end_datetime);
        formData.append('address', address);
        formData.append('distancetravelled', totalDistance);
        formData.append('avgspeed', miles);
        formData.append('vin_no', vin_no);
        formData.append('total', totTime)

        let response = await APICALL('erallye/save_trip', 'POST', formData)
        this.setState({ loading: false }, () => {
            console.log('totalDistance ===> : ' + this.state.totalDistance)
            console.log('totalDistance ===> : ' + this.state.totalDistance)
            console.log('averageSpeed ===> : ' + this.state.miles)
            console.log("formData : " + JSON.stringify(formData))
        })
        if (response.status === 'success') {
            showToast(response.message)
            console.log('success response', response)
            this.fetchTripValues(user_id)
        } else {
            let message = 'Something went wrong'
            if (response.message !== undefined) {
                message = response.message
                showToast(message, 'error')
            }
        }
    }

    verifyData = async (verifyValue) => {
        const { user_id, modal_no, entity_id, vin_no, dealership_id } = this.state;

        var formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('modal_no', modal_no);
        formData.append('entity_id', entity_id);
        formData.append('vin_no', vin_no);
        formData.append('dealership_id', dealership_id);

        let response = await APICALL('erallye/add_vehicle_toverify', 'POST', formData);
        this.setState({ loading: false, verifyData: !verifyValue }, () => {

            console.log('verify form data==>' + JSON.stringify(formData)),
                console.log('verify form data response ==>' + JSON.stringify(response))
        });

        let responseVerify = await APICALL(`erallye/myvehicle/${this.state.user_id}`, 'GET');
        console.log('verify vehicle ==>' + JSON.stringify(responseVerify)),
            console.log('verify vehicle id==>' + JSON.stringify(responseVerify.data.is_verified = "0"))

        this.setState({ vehicleId: responseVerify.data.is_verified })

    }

    fetchTripValues = async (user_id) => {
        let response = await APICALL(`erallye/mytrip/${user_id}`, 'GET')
        console.log("new Modal all value ===> " + JSON.stringify(response.data))
        var tripsItems = this.state.tripsItems
        let timeDiff = '';
        var newdata = response.data
        for (let i = 0; i < response.data.length; i++) {
            var start = response.data[i].start_datetime;
            var end = response.data[i].end_datetime;

            var startVal = start.split(' ')
            var nend = startVal[0] + "T" + startVal[1];

            var endVal = end.split(' ')
            var eeVal = endVal[0] + "T" + endVal[1];

            var dt1 = new Date(nend)
            var dt2 = new Date(eeVal)

            //var dt3 = (dt2.getMinutes() - dt1.getMinutes());

            var diffMs = (dt2 - dt1); // milliseconds between now & Christmas
            // var diffDays = Math.floor(diffMs / 86400000); // days
            // var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.floor((diffMs / 1000) / 60);; // minutes
            //alert(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until Christmas 2009 =)");
            // tripsItems[i].total = diffMins
            console.log('dt1 ==>' + dt1)
            console.log('dt2 ==>' + dt2)
            console.log('dt3 ==>' + diffMins)
            timeDiff = diffMins
            console.log('time diff' + JSON.stringify(timeDiff))
            newdata[i].total = diffMins

        }
        // this.setState({tripsItems})
        // this.setState({ totTime: timeDiff }, () => {
        //     console.log('tot ==>' + timeDiff)
        // })

        this.setState({ tripsItems: newdata })
    }

    onViewTrips = async () => {
        const value = await AsyncStorage.getItem('loginData');
        console.log('user id ->', JSON.parse(value).id);
        this.fetchTripValues(JSON.parse(value).id)
        this.setState({ showTrips: !this.state.showTrips })
    }

    goToScheduleMaintainScreen = () => {
        this.props.navigation.navigate('ScheduledMaintenanceScreen')
    }

    goToHealthRisksScreen = () => {
        this.props.navigation.navigate('HealthRiskScreen')
    }


    render() {
        const { open, value, item } = this.state;

        return (

            <SafeAreaView style={{ flex: 1, backgroundColor: '#595959' }}>
                <Header backButton={true} />
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150, marginTop: 26 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.main_container}>
                        <DropDown
                            placeholder={'Make'}
                            value={this.state.selectedMakeValue}
                            menuData={this.state.items}
                            onSelectItem={(item, modalId) => this.SelectedMakeValue(item, modalId)}
                        />

                        <SectionDropDown
                            placeholder={'Model'}
                            value={this.state.selectedItems}
                            menuData={this.state.entity_modal}
                            subData={this.state.entity_modal}
                            onSelectItem={(data, itemId) => this.SelectedModelValue(data, itemId)}
                        />

                        <DropDown_dealership
                            placeholder={'Dealership'}
                            value={this.state.selectedDealership}
                            menuData={this.state.dealership}
                            onSelectItem={(selectItem, dealshipId) => this.selectDealership(selectItem, dealshipId)}
                            DropdownPropStyle={{ marginTop: 20 }}
                        />
                        <TextInput
                            placeholder={'VIN #:'}
                            placeholderTextColor="black"
                            style={styles.textInput}
                            value={this.state.vin_no}
                            // onChangeText={(vin_no) => this.setState({vin_no})}
                            onChangeText={(VinNo) => this.selectVinNo(VinNo)}
                        />
                        {this.state.vehicleId !== "0" ?
                            <TouchableOpacity style={styles.verifyBtn} onPress={() => this.state.vin_no ? this.verifyData(this.state.verifyData) : showToast('Please Select make, model, Dealership, VIN #', "warning")}>
                                <Text style={styles.buttonText}> Verify </Text>
                            </TouchableOpacity>
                            : 
                            <View></View>
                        }

                        {this.state.vehicleId !== null && this.state.vehicleId !== "1" ?
                            <View>
                                <View style={styles.horizontalLine}></View>
                                <View style={styles.trips}>
                                    <TouchableOpacity style={this.state.startTrip ? styles.buttontrue : styles.button} onPress={() => {
                                        this.state.selectedMakeValue && this.state.selectedItems && this.state.selectedDealership && this.state.vin_no ? this.onStartTime(this.state.startTrip) : showToast('Please Select make, model, Dealership, VIN #', "warning")
                                    }} >
                                        <Text style={styles.buttonText}>Start Trip</Text>
                                    </TouchableOpacity>
                                    <View style={styles.directionRow}>
                                        <Image source={require('../../assets/images/Picture4.png')} style={styles.mapImg} />
                                        <View style={styles.accelerometerButton}>
                                            <Text style={styles.buttonText}>{this.state.miles}m/</Text>
                                            <Text style={styles.buttonText}>{this.state.totalDistance}km</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={this.state.endTrip ? styles.buttontrue : styles.button} onPress={() => this.state.start_datetime ? this.onEndTime(this.state.endTrip) : showToast('No trip is started yet!', "warning")}>
                                        <Text style={styles.buttonText} > End Trip </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.horizontalLine}></View>
                                <TouchableOpacity style={styles.dropdwonEnd} onPress={this.onViewTrips}>
                                    <Text style={styles.buttonText}>Driving History</Text>
                                    {this.state.showTrips ?
                                        <Icon name="keyboard-arrow-up" size={25} style={{ position: 'absolute', right: 12 }} /> :
                                        <Icon name="keyboard-arrow-down" size={25} style={{ position: 'absolute', right: 12 }} />
                                    }
                                </TouchableOpacity>
                                {this.state.showTrips ? (
                                    console.log('item ===>', this.state.tripsItems),
                                    <FlatList
                                        style={styles.tripsView}
                                        data={this.state.tripsItems}
                                        renderItem={this.renderTripText}
                                        // keyExtractor={(item, index) =>item +  index.toString()}  // bottom to top data
                                        ItemSeparatorComponent={() => <View style={styles.separator}
                                        />}
                                    />

                                ) : null
                                }
                                <View style={styles.scheduled_view}>
                                    <TouchableOpacity style={styles.scheduled_text_view}
                                        onPress={this.goToScheduleMaintainScreen}>
                                        <Image style={styles.icons} source={require('../../assets/images/tools.png')} />
                                        <Text style={styles.scheduled_text}>Scheduled Maintenance</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.scheduled_text_view}
                                        onPress={this.goToHealthRisksScreen}>
                                        <Image style={styles.icons} source={require('../../assets/images/trophy.png')} />
                                        <Text style={styles.scheduled_text}>Health & Safety Risks</Text>
                                    </TouchableOpacity>
                                    {/* <Image style={styles.bikeImg} source={require('../../assets/images/bike.png')} /> */}
                                </View>
                                <TouchableOpacity style={styles.saveToWalletButton} onPress={this.goToScanBarCodeScreen}>
                                    <Text style={styles.buttonText}> Go to Wallet </Text>
                                </TouchableOpacity>
                            </View>


                            : <View></View>}

                        {/* <TouchableOpacity onPress={this.dateTimeFormat}>
                            <Text>Format</Text>
                        </TouchableOpacity> */}
                        {/* <Text>Prev Lat: {this.state.pervlat}</Text>
                        <Text>Prev Long: {this.state.pervlog}:</Text>
                        <Text>Start Lat {this.state.startlat}</Text>
                        <Text>Start Long {this.state.startlog}</Text>
                        <Text>Current Lat: {this.state.currentlat} </Text>
                        <Text>Current Long: {this.state.currentlog} </Text>
                        <Text>End Lat: {this.state.endlat}</Text>
                        <Text>End Long: {this.state.endlong} </Text>
                        <Text>Average Speed: {this.state.averageSpeed} </Text>
                        <Text>Total Time  : {this.state.avgtotaltime} </Text>
                        <Text>Total Distance/km: {this.state.totalDistance}</Text> */}

                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
