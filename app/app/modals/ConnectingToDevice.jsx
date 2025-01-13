import { View, Text } from 'react-native'
import React, {useState} from 'react'
import PopUpWithButton from '../components/PopUpWithButton'

const ConnectingToDevice = () => {
    const [connectedDevice, setConnectedDevice] = useState(null);

    const handleConnection = async (device) => {
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
        saveConnectedDevice();
      }, [connectedDevice])

    return (
        <PopUpWithButton text='Connecting' buttonText='cancel'/>
    )
}

export default ConnectingToDevice