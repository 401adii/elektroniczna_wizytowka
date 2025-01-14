import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ConnectingToDevice from '../modals/ConnectingToDevice'
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic'
import EnableBluetooth from '../modals/EnableBluetooth'

const ChoiceScreen = ({navigation}) => {

  const [defaultDevice, setDefaultDevice] = useState(null);
  const [deviceObject, setDeviceObject] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [readyToSend, setReadyToSend] = useState(false);
  
  const loadDefaultDevice = async () => {
    try {
      const device = await AsyncStorage.getItem('defaultDevice');
      if(device !== null)
        setDefaultDevice(JSON.parse(device));
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleWrite = async (data) => {
    try {
      await deviceObject.write(data);
    }
    catch(error){
      console.error(error);
    }
  }

  const getDevice = async () => {
    try{
      const devices = await RNBluetoothClassic.getBondedDevices();
      if(devices !== null){
        const device = devices.find(d => d._nativeDevice?.address === defaultDevice._nativeDevice?.address);
        if(device !== null)
          setDeviceObject(device);
      }
    }
    catch(error){
      console.error(error);
    }
  }

  const connect = async () => {
    try{
      const connected = await deviceObject.connect();
      if(connected)
        setIsConnected(true);
    }
    catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    loadDefaultDevice();
  }, [])

  useEffect(() => {
    if(deviceObject !== null){
      console.log('attempting connect');
      connect();
    }
  }, [deviceObject])
  console.log(readyToSend);
  return (
    <View className='flex-1 items-center justify-center p-4 gap-4'>
      <Button onPress={() => setReadyToSend(true)} text='1'/>
      <Button onPress={() => handleWrite('2')} text='2'/>
      <Button onPress={() => handleWrite('3')} text='3'/>
      <Button onPress={() => getDevice()} text='connect'/>
      <Button onPress={() => navigation.navigate('ConnectionScreen')} text='change device'/>
      {readyToSend ? <EnableBluetooth onEnabled={() => console.log('enabled')}/> : null }
    </View>
  )
}

export default ChoiceScreen