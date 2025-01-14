import {ScrollView, Text, PermissionsAndroid, FlatList, View} from 'react-native'
import React, {useState, useEffect} from 'react'
import RequestPermission from '../modals/RequestPermission';
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic'
import EnableBluetooth from '../modals/EnableBluetooth';
import DeviceListItem from '../components/DeviceListItem';
import ConnectingToDevice from '../modals/ConnectingToDevice';
import Button from '../components/Button';

const ConnectionScreen = ({navigation}) => {

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [deviceToConnect, setDeviceToConnect] = useState(null);
  const [isActive, setIsActive] = useState(false);

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
    const subscription = RNBluetoothClassic.onStateChanged(() => getPairedDevices());

    return () => {
      subscription.remove(); 
    };
  }, []);

  useEffect(() =>{
    if(!isActive)
      setIsActive(true);
  },[isActive])

  return (
    <ScrollView>
      <RequestPermission onPermissionGranted={() => handlePermissionGranted()} visible={!permissionGranted}/>
      {permissionGranted && isActive ? <EnableBluetooth onEnabled={() => {}}/> : null}
      <ConnectingToDevice device={deviceToConnect}
                          visible={deviceToConnect === null ? false : true}
                          onCancel={() => setDeviceToConnect(null)} 
                          onConnected={() => {setDeviceToConnect(null); setIsActive(false); navigation.navigate('ChoiceScreen');}} 
                          onNotConnected={() => setDeviceToConnect(null)}/>
      {pairedDevices.length === 0 ? 
      <View className='flex-1 justify-center p-2 items-center gap-2'>
        <Text className='text-center'> No paired devices foud</Text>
        <Button text='open settings' onPress={() => RNBluetoothClassic.openBluetoothSettings()}></Button>
        <Button text='refresh' onPress={() => navigation.navigate('ConnectionScreen')}></Button>
      </View> : null}
      <FlatList data={pairedDevices}
                renderItem={({item}) => (
                  <DeviceListItem deviceName={item._nativeDevice?.name} deviceAdress={item._nativeDevice?.address} onPress={() => setDeviceToConnect(item)}/>
                )}
      />
    </ScrollView>
  )
}

export default ConnectionScreen