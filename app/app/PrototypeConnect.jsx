import { View, Text, PermissionsAndroid, Modal, TouchableHighlight, ScrollView, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PrototypeConnect = () => {

  const [btEnabled, setBtEnabled] = useState(false);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [connectedDevice, setconnectedDevice] = useState(null);
  const [dataToSend, setDataToSend] = useState(null);
  
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



  const getPairedDevices = async () => {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      if(devices !== null)
        setPairedDevices(devices);
    }
    catch(error){
      console.error(error);
    }
  }


  const handleConnection = async (device) => {
    try{
      if(device === null)
          return;

      const connected = await device.connect();
      
      if(connected){
        setconnectedDevice(device);
      }
    }
    catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    requestFineLocationPermission();
    requestBluetoothConnectPermission();

    const checkBTInterval = setInterval(() => {
      checkBT();
      if(btEnabled)
        clearInterval(checkBTInterval);
    }, 500)

    return () => clearInterval(checkBTInterval);

  },[])

  const readSavedData = async () => {
    try{
      const jsonData = await AsyncStorage.getItem('data');
      if(jsonData !== null)
        setDataToSend(jsonData);
    }
    catch(error){
      console.error(error);
    }
  }

  const handleDisconnect = async () => {
    try{
      const disconnect = await connectedDevice.disconnect();

      if(disconnect !== null)
        connectedDevice(null);
    }
    catch(error){
      console.error(error);
    }
  }

  const handleWrite = async () => {
    try{
      const sentData = await connectedDevice.write(dataToSend);
    }
    catch(error){
      console.error(error);
    }
  }

  useEffect(() =>{
    if(connectedDevice === null)
      return;
    readSavedData();
  }, [connectedDevice])

  useEffect(() => {
    if(dataToSend === null)
      return;

    console.log('sending data', dataToSend);
    handleWrite();
  },[dataToSend])



  return (
    <View className='flex-1 items-center justify-center mt-4'>
      <Modal transparent={true} visible={!btEnabled}>
        <View className='flex-1 items-center justify-center bg-[rgba(0,0,0,0.2)]'>
          <View className='border rounded items-center justify-center bg-white p-2 w-1/2 h-1/4'>
            <Text className='text-center'>Enable Bluetooth to continue!</Text>
          </View>
        </View>
      </Modal> 
      <TouchableHighlight className='bg-orange-500 rounded p-2' underlayColor='lightsalmon'
                          onPress={() => getPairedDevices()}>
        <Text className='text-white'>GET PAIRED DEVICES</Text>
      </TouchableHighlight>
      { connectedDevice !== null ? <Text>Connection succesful, sending data...</Text>
        :
        <ScrollView>
        {pairedDevices.length === 0 ? <Text>No paired devices found</Text> : 
          <FlatList data={pairedDevices} renderItem={({item}) => (
            <TouchableHighlight className='bg-blue-400 rounded p-2 my-2' underlayColor='lightsalmon'
            onPress={() => {handleConnection(item)}}>
              <Text className='text-white'>{item._nativeDevice?.name}</Text>
            </TouchableHighlight>
          )}/>}
      </ScrollView>
      }
    </View>
  )
}

export default PrototypeConnect