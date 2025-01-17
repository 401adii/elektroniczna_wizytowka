import {ScrollView, Text, PermissionsAndroid, FlatList, View} from 'react-native'
import React, {useState, useEffect} from 'react'
import RequestPermission from '../modals/RequestPermission';
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic'
import EnableBluetooth from '../modals/EnableBluetooth';
import DeviceListItem from '../components/DeviceListItem';
import ConnectingToDevice from '../modals/ConnectingToDevice';
import Button from '../components/Button';

const ConnectionScreen = ({navigation}) => {

  const [pairedDevices, setPairedDevices] = useState([]);
  const [deviceToConnect, setDeviceToConnect] = useState(null);


  
  return (
    <ScrollView>
      <EnableBluetooth/>
      <RequestPermission/>
      <ConnectingToDevice device={deviceToConnect}
                          visible={deviceToConnect === null ? false : true}
                          onCancel={() => setDeviceToConnect(null)} 
                          onConnected={() => {setDeviceToConnect(null); navigation.navigate('ChoiceScreen');}} 
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