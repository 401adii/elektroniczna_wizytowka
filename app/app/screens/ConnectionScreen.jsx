import {ScrollView, Text, PermissionsAndroid, FlatList } from 'react-native'
import React, {useState, useEffect} from 'react'
import RequestPermission from '../modals/RequestPermission';
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import EnableBluetooth from '../modals/EnableBluetooth';

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
    }
  }

  useEffect(() =>{
    checkPermission();
    getPairedDevices();
  }, [permissionGranted])

  return (
    <ScrollView>
      {!permissionGranted ? <RequestPermission onPermissionGranted={() => handlePermissionGranted()}/> : null}
      <EnableBluetooth />
      <FlatList data={pairedDevices} renderItem={({item}) => (
          <Text>Device</Text>
      )}/>
    </ScrollView>
  )
}

export default ConnectionScreen