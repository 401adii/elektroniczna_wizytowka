import {ScrollView, Text, PermissionsAndroid, FlatList, ToastAndroid} from 'react-native'
import React, {useState, useEffect} from 'react'
import RequestPermission from '../modals/RequestPermission';
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic'
import EnableBluetooth from '../modals/EnableBluetooth';
import DeviceListItem from '../components/DeviceListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnectionScreen = () => {

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [pairedDevices, setPairedDevices] = useState([]);

  const checkPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      setPermissionGranted(granted);
    }
    catch(error) {
      console.error(error);
    }
  }

  const handlePermissionGranted = () => {
    setPermissionGranted(true);
    handleBluetoothEnabled();
  }
  
  const getPairedDevices = async () => {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      
      if(devices !== null)
        setPairedDevices(devices);
    }
    catch(error) {
      console.error(error);
      setPairedDevices([])
    }
  }

  useEffect(() =>{
    checkPermission();
    getPairedDevices();
  }, [permissionGranted])
  
  useEffect(() => {
    const subscription = RNBluetoothClassic.onStateChanged(() => {getPairedDevices()});

    return () => {
      subscription.remove(); 
    };
  }, []);

  return (
    <ScrollView>
      <RequestPermission onPermissionGranted={() => handlePermissionGranted()} visible={!permissionGranted}/>
      <EnableBluetooth/>
      {pairedDevices.length === 0 ? <Text>No devices found</Text>: null}
      <FlatList data={pairedDevices}
                renderItem={({item}) => (
                  <DeviceListItem deviceName={item._nativeDevice?.name} deviceAdress={item._nativeDevice?.address} onPress={() => handleConnection(item)}/>
                )}
      />
    </ScrollView>
  )
}

export default ConnectionScreen