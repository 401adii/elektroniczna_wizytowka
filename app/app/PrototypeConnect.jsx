import { View, Text, PermissionsAndroid, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic'

const PrototypeConnect = () => {

  const [btEnabled, setBtEnabled] = useState(false);
  
  const requestBluetoothConnectPermission = async () => {
    try{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'The app requires access to Bluetooth',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      )
    }
    catch(error){
      console.error(error)
    }
  }

  const requestFineLocationPermission = async () => {
    try{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'The app requires access to fine location',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      )
    }
    catch(error){
      console.error(error);
    }
  }

  const checkBT = async () => {
    try{
      const status = await RNBluetoothClassic.isBluetoothEnabled();
      setBtEnabled(status);
    }
    catch(error){
      console.error(error);
    }
  }

  const checkBTInterval = setInterval(() => {
    checkBT();
    if(btEnabled)
      clearInterval(checkBTInterval);
  }, 500)

  useEffect(() => {
    requestFineLocationPermission();
    requestBluetoothConnectPermission();
  },[])
  
  return (
    <View className='flex-1 items-center justify-center'>
      <Modal transparent={true} visible={!btEnabled}>
        <View className='flex-1 items-center justify-center bg-[rgba(0,0,0,0.2)]'>
          <View className='border rounded items-center justify-center bg-white p-2 w-1/2 h-1/4'>
            <Text className='text-center'>Enable Bluetooth to continue!</Text>
          </View>
        </View>
      </Modal> 
        <Text>connect</Text>
    </View>
  )
}

export default PrototypeConnect