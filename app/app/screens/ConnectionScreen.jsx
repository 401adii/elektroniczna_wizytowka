import {ScrollView, Text, FlatList, View} from 'react-native'
import React, {useState, useEffect, useCallback} from 'react'
import RequestPermission from '../modals/RequestPermission';
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import EnableBluetooth from '../modals/EnableBluetooth';
import DeviceListItem from '../components/DeviceListItem';
import ConnectingToDevice from '../modals/ConnectingToDevice';
import Button from '../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnectionScreen = ({navigation}) => {

  const [bondedDevices, setBondedDevices] = useState([]);
  const [deviceToConnect, setDeviceToConnect] = useState(null);
  const [focusFlag, setFocusFlag] = useState(true);
  const [skipFlag, setSkipFlag] = useState(false);

  const checkStorage = async () => {
    try {
      const device = await AsyncStorage.getItem('defaultDevice');
      if(device !== null)
        navigation.navigate('ChoiceScreen');
    }
    catch(error) {
      console.error('Connection screen -> checkStorage(): ', error);
    }

  }

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

  const handleOnConnected = () => {
    setDeviceToConnect(null);
    navigation.navigate('ChoiceScreen')
  }

  useEffect(() => {
    checkStorage();
  }, [])

  useFocusEffect( 
    useCallback(() => {
      setFocusFlag(true);
      getDevices();
      return () => {
        setFocusFlag(false);
        setBondedDevices([]);
      }
    }, [])
  )
  
  return (
    <ScrollView>
      {focusFlag ? <EnableBluetooth onEnabled={() => getDevices()}/> : null}
      <RequestPermission/>
      {deviceToConnect !== null ?
      <ConnectingToDevice device={deviceToConnect} 
                          onConnected={() => handleOnConnected()}
                          onCancel={() => setDeviceToConnect(null)}/> : null}
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

export default ConnectionScreen