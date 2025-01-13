import React, {useState, useEffect} from 'react'
import PopUpWithButton from '../components/PopUpWithButton'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ConnectingToDevice = ({device, visible, onCancel}) => {
    
    const [connectedDevice, setConnectedDevice] = useState(null);

    const handleConnection = async () => {
        try {
          const connected = await device.connect();
          
          if(connected)
            setConnectedDevice(device);
    
        }
        catch(error) {
          console.error(error);
          ToastAndroid.showWithGravity(`Cannot connect to ${device._nativeDevice?.name}`, ToastAndroid.LONG, ToastAndroid.BOTTOM);
        }
    }

    const saveConnectedDevice = async () => {
        try {
          const deviceData = JSON.stringify(device)
          await AsyncStorage.setItem('defaultDevice', deviceData)
        }
        catch(error) {
          console.error(error);
        }
    }

    useEffect(() => {
        if(visible)
            handleConnection();
    }, [visible])
    
    useEffect(() => {
        if(connectedDevice)
            saveConnectedDevice();

    }, [connectedDevice])

    return (
        <PopUpWithButton text='Connecting...' buttonText='cancel' visible={visible} onPress={onCancel}/>
    )
}

export default ConnectingToDevice