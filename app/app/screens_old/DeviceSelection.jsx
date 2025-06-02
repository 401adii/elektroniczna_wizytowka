import {ScrollView, Text, FlatList, View} from 'react-native'
import React, {useState, useEffect, useCallback} from 'react'
import RequestPermission from '../modals/RequestPermission';
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import EnableBluetooth from '../modals/EnableBluetooth';
import DeviceListItem from '../components/DeviceListItem';
import ConnectToDevice from '../modals/ConnectToDevice';
import Button from '../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeviceSelection = ({navigation, route}) => {

  const [bondedDevices, setBondedDevices] = useState([]);
  const [deviceToConnect, setDeviceToConnect] = useState(null);
  const [focusFlag, setFocusFlag] = useState(true);
  const [skipFlag, setSkipFlag] = useState(false);
  const [data, setData] = useState([]);

  const getDevices = async () => {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      if(devices)
        setBondedDevices(devices);
    }
    catch(error) {
      console.error('Connection screen -> getDevices(): ', error);
    }
  }

  const handleOnConnected = async () => {
    setDeviceToConnect(null);
    // for(const str of data){
    //   try{
    //     await device.send(str);
    //   }
    //   catch(error){
    //     console.error("error while sending", error);
    //   }
    // }

  }

  useFocusEffect(
    useCallback(() => {
      if (route.params?.dataToSend) {
        setData(route.params.dataToSend);
        //console.log("Data:", route.params.dataToSend);
      }
    }, [route.params?.dataToSend])
  );

  
  return (
    <ScrollView>
      {focusFlag ? <EnableBluetooth onEnabled={() => getDevices()}/> : null}
      <RequestPermission/>
      {deviceToConnect !== null ?
      <ConnectToDevice device={deviceToConnect} 
                          onConnected={() => handleOnConnected()}
                          onCancel={() => setDeviceToConnect(null)}
                          data={data}/> : null}
      {bondedDevices.length === 0 ? 
      <View className='flex-1 justify-center p-2 items-center gap-2'>
        <Text className='text-center'> No paired devices foud</Text>
        <Button text='open settings' onPress={() => RNBluetoothClassic.openBluetoothSettings()}></Button>
      </View> : null}
      <FlatList data={bondedDevices}
                renderItem={({item}) => (
                  <DeviceListItem deviceName={item._nativeDevice?.name} 
                                  deviceAdress={item._nativeDevice?.address} 
                                  onPress={() => setDeviceToConnect(item)}/>
                )}
      />
    </ScrollView>
  )
}

export default DeviceSelection