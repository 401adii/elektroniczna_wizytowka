import {ToastAndroid, View} from 'react-native'
import React, {useState} from 'react'
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EnableBluetooth from '../modals/EnableBluetooth'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import ConnectingToDevice from '../modals/ConnectingToDevice'

const ChoiceScreen = ({navigation}) => {

  const [data, setData] = useState('nothing');
  const [deviceObject, setDeviceObject] = useState(null);
  const [btFlag, setBtFlag] = useState(false);

  const handleSendData = async () => {
    setBtFlag(true);
    await getDeviceJson();
  }

  const getDeviceJson = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('defaultDevice');
      if(jsonData !== null){
        await getDeviceObject(JSON.parse(jsonData));
      }
    }
    catch(error) {
      console.error('Choice screen, getDeviceJson(): ', error);
    }
  }
  
  const getDeviceObject = async (jsonData) => {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      if(devices !== null){
        console.log(jsonData);
        const object = devices.find(d => d._nativeDevice?.address === jsonData._nativeDevice?.address);
        if(object !== null)
          setDeviceObject(object);
      }
    }
    catch(error) {
      console.error('Choice screen, getDeviceObject(): ', error);
    }
  }

  const handleOnConnected = async () => {
    try {
      const written = await deviceObject.write(data);
      setBtFlag(false);
      if(written !== null){
        ToastAndroid.showWithGravity('Data updated succesfully!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        setDeviceObject(null);
        await disconnectDevice();
      }
    }
    catch(error) {
      console.error('Choice screen, handleOnConnected(): ', error);
    }
  }
  
  const disconnectDevice = async () => {
    try{
      await deviceObject.disconnect();
    }
    catch(error){
      console.error('Choice screen, disconnectDevice(): ', error);
    }
  }

  return (
    <View className='flex-1 items-center justify-center p-4 gap-4'>
      <Button onPress={() => navigation.navigate('CredentialsEditor')} text='1'/>
      <Button onPress={() => setData('2')} text='2'/>
      <Button onPress={() => setData('3')} text='3'/>
      <Button onPress={() => navigation.goBack()} text='change device'/>
      <Button onPress={() => handleSendData()} text='send data'/>
      {btFlag ? <EnableBluetooth onEnabled={() => {setBtFlag(false); handleSendData();}}/> : null }
      {deviceObject !== null ?
      <ConnectingToDevice device={deviceObject} 
                          onConnected={() => handleOnConnected()}
                          onCancel={() => setDeviceObject(null)}/> : null}
    </View>
  )
}

export default ChoiceScreen