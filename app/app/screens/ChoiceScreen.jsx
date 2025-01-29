import {ToastAndroid, View} from 'react-native'
import React, {useCallback, useState} from 'react'
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EnableBluetooth from '../modals/EnableBluetooth'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import ConnectingToDevice from '../modals/ConnectingToDevice'
import { useFocusEffect } from '@react-navigation/native'

const ChoiceScreen = ({navigation, route}) => {

  const [data, setData] = useState('');
  const [deviceObject, setDeviceObject] = useState(null);
  const [btFlag, setBtFlag] = useState(false);
  const { newData } = route.params;

  const handleSendData = async () => {
    setBtFlag(true);
    console.log('sending data');
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
      const parsedData = convertJsonToString(data);
      console.log(parsedData);
      const written = await deviceObject.write(parsedData);
      setBtFlag(false);
      if(written !== null){
        ToastAndroid.showWithGravity('Data updated succesfully!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        setDeviceObject(null);
      }
    }
    catch(error) {
      console.error('Choice screen, handleOnConnected(): ', error);
    }
  }

  const convertJsonToString = (json) => {
    const stringifiedJson = JSON.stringify(json);
    const formattedString = stringifiedJson.replace(/[{}"]/g, '').replace(/,/g, '\n') + '\r';
    return formattedString;
  }

  useFocusEffect(
    useCallback(() => {
      if(newData !== "")
        setData(newData);
    },[])
  )

  return (
    <View className='flex-1 items-center justify-center p-4 gap-4'>
      <Button onPress={() => navigation.navigate('CredentialsEditor')} text='1'/>
      <Button onPress={() => setData('2')} text='2'/>
      <Button onPress={() => setData('3')} text='3'/>
      <Button onPress={() => navigation.goBack()} text='change device'/>
      <Button onPress={() => setBtFlag(true)} text='send data'/>
      {btFlag ? <EnableBluetooth onEnabled={() => {setBtFlag(false); handleSendData();}}/> : null }
      {deviceObject !== null ?
      <ConnectingToDevice device={deviceObject} 
                          onConnected={() => handleOnConnected()}
                          onCancel={() => setDeviceObject(null)}/> : null}
    </View>
  )
}

export default ChoiceScreen