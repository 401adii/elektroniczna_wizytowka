import { ToastAndroid } from 'react-native'
import React, {useState, useEffect} from 'react'
import PopUpWithButton from '../components/PopUpWithButton'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ConnectingToDevice = ({device, visible, onCancel, onConnected, onNotConnected}) => {
    
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [attempts, setAttempts] = useState(3);
    const [count, setCount] = useState(0);

    const handleConnection = async () => {
        try {
          const connected = await device.connect();
          
          if(connected === true){
            setConnectedDevice(device);
            onConnected();
          }
    
        }
        catch (error) {
            console.error(error);
            setCount((c) => {
              const newCount = c + 1;
              if (newCount === attempts) {
                ToastAndroid.showWithGravity(`Cannot connect to ${device._nativeDevice?.name}`, ToastAndroid.LONG, ToastAndroid.BOTTOM);
                onCancel();
              }
              return newCount;
            });
          }
    }

    const saveConnectedDevice = async () => {
      try {
        const deviceData = JSON.stringify(connectedDevice)
        await AsyncStorage.setItem('defaultDevice', deviceData)
      }
      catch(error) {
        console.error(error);
      }
  }

    const callMethodNTimes = async (fn, n, interval) => {
        for (let i = 0; i < n; i++) {
            await new Promise((resolve) => setTimeout(resolve, interval));
            await fn();
        }
    }

    useEffect(() => {
        if(visible){
            callMethodNTimes(handleConnection, attempts, 1000);
            setCount(0);
        }
    }, [visible])
    
    useEffect(() => {
        if(connectedDevice)
            saveConnectedDevice();
    }, [connectedDevice])

    return (
        <PopUpWithButton text='Connecting...' buttonText='cancel' visible={visible} onPress={() => onCancel()}/>
    )
}

export default ConnectingToDevice

//to do:
//find a way to cancel connection