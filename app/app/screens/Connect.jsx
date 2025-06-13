import {ScrollView, Text, FlatList, View} from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import RequestPermission from '../modals/RequestPermission';
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import EnableBluetooth from '../modals/EnableBluetooth';
import DeviceListItem from '../components/DeviceListItem';
import Button from '../components/Button';
import PopUpWithButton from '../components/PopUpWithButton';
import CryptoJS from 'crypto-js'
import { SECRETKEY } from '../components/Password';

const Connect = ({navigation, route}) => {
  
  const {data} = route.params

  const [bondedDevices, setBondedDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelFlag, setCancelFlag] = useState(false);

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

  const handleConnect = async (device) => {
    setModalVisible(true);
    try{
      const connected = await device.connect({useExternal: true, DELIMITER: '\n'});
      if(connected === true && cancelFlag === false){
        handleReceive(device);
        
      }
      else{
        handleDisconnect(device);
      }
      setModalVisible(false);
    }
    catch{
      console.error('error while connecting');
    }
  }

  const handleSend = async (device) => {
    for(const str of data)
      try{
        console.log(str);
        await device.write(str);
      }
      catch{
        console.error('error while sending', error);
      }
      await new Promise(resolve => setTimeout(resolve, 10000));
      await handleDisconnect(device);
  }

  const handleReceive = async (device) => {
    try {
      let message;
      do{
        message = await device.read();
      }while(message === null)
      const clean = message.trim();
      const hash = CryptoJS.HmacSHA256(clean, SECRETKEY);
      console.log(hash.toString(CryptoJS.enc.Hex));
      await device.write(hash.toString(CryptoJS.enc.Hex) + "\n");
      handleSend(device)
    }
    catch{
      console.error('error while reading');
    }
  }

  const handleDisconnect = async (device) => {
    setCancelFlag(false);
    try{
      console.log('disconnecting')
      await device.disconnect();
    }
    catch{
      console.error('error while disconnecting', error);
    }
  }

useEffect(() => {
    getDevices();

    const bluetoothEnabledSubscription = RNBluetoothClassic.onBluetoothEnabled(() => {
      console.log('Bluetooth enabled - refreshing devices');
      getDevices();
    });

    return () => {
      if (bluetoothEnabledSubscription) {
        bluetoothEnabledSubscription.remove();
      }
    };
  }, []);

  return (
    <ScrollView>
      <RequestPermission/>
      <EnableBluetooth/>
      <PopUpWithButton text="Connecting..."
      buttonText="cancel"
      visible={modalVisible}
      onPress={() => {setCancelFlag(true); setModalVisible(false)}}/>
      {bondedDevices.length === 0 ? 
      <View className='flex-1 justify-center p-2 items-center gap-2'>
        <Text className='text-center'> No paired devices found</Text>
        <Button text='open settings' onPress={() => RNBluetoothClassic.openBluetoothSettings()}></Button>
      </View> : null}
      <FlatList data={bondedDevices}
                renderItem={({item}) => (
                  <DeviceListItem deviceName={item._nativeDevice?.name} 
                                  deviceAdress={item._nativeDevice?.address} 
                                  onPress={() => handleConnect(item)}/>
                )}
      />
    </ScrollView>
  )
}

export default Connect