import {ScrollView, Text, FlatList, View} from 'react-native'
import React, {useState, useEffect, useCallback} from 'react'
import RequestPermission from '../modals/RequestPermission';
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import EnableBluetooth from '../modals/EnableBluetooth';
import DeviceListItem from '../components/DeviceListItem';
import ConnectingToDevice from '../modals/ConnectingToDevice';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ConnectionScreen = ({navigation}) => {

  const [btEnabled, setBtEnabled] = useState(false);
  const [bondedDevices, setBondedDevices] = useState([]);
  const [deviceToConnect, setDeviceToConnect] = useState(null);
  const [focusFlag, setFocusFlag] = useState(true);

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

  const connectToDevice = async () => {
    try {
      const connected = await deviceToConnect.connect();
      if(connected === true){
        saveDevice();
      }
    }
    catch(error) {
      console.error('Connection screen -> connectToDevice(): ', error);
    }
  }

  const saveDevice = async () => {
    try {
      const jsonValue = JSON.stringify(deviceToConnect);
      await AsyncStorage.setItem('defaultDevice', jsonValue);
    }
    catch(error) {
      console.error('Connection screen -> saveDevice(): ', error);
    }
  }

  useEffect(() => {
    if(btEnabled === true)
      getDevices();
  },[btEnabled])

  useEffect(() => {
    if(deviceToConnect !== null)
      connectToDevice();
  }, [deviceToConnect])

  useFocusEffect( 
    useCallback(() => {
      setFocusFlag(true);
      console.log('hello');
      return () => {
        setFocusFlag(false);
        setBondedDevices([]);
      }
    }, [])
  )
  
  return (
    <ScrollView>
      {focusFlag ? <EnableBluetooth onEnabled={() => setBtEnabled(true)}/> : null}
      <RequestPermission/>
      <ConnectingToDevice device={deviceToConnect}
                          visible={deviceToConnect === null ? false : true}
                          onCancel={() => setDeviceToConnect(null)} 
                          onConnected={() => {setDeviceToConnect(null); navigation.navigate('ChoiceScreen');}} 
                          onNotConnected={() => setDeviceToConnect(null)}/>
      {bondedDevices.length === 0 ? 
      <View className='flex-1 justify-center p-2 items-center gap-2'>
        <Text className='text-center'> No paired devices foud</Text>
        <Button text='open settings' onPress={() => RNBluetoothClassic.openBluetoothSettings()}></Button>
        <Button text='refresh' onPress={() => navigation.navigate('ConnectionScreen')}></Button>
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

export default ConnectionScreen