import { ToastAndroid } from 'react-native'
import React, {useState, useEffect} from 'react'
import PopUpWithButton from '../components/PopUpWithButton'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ConnectingToDevice = ({device, onConnected, onCancel}) => {

	const [chosenDevice, setChosenDevice] = useState(null);

	const handleOnCancel = () => {
		onCancel();
		setChosenDevice(null);
	}

	const handleConnect = async () => {
		try {
			const connected = await device.connect();
			if(connected === true){
				saveDevice();
				setChosenDevice(null);
				onConnected();
			}
		}
		catch(error) {
			error.log('Connecting to device -> handleConnect(): ', error);
		}
	}

	const saveDevice = async () => {
		try {
			const check = await AsyncStorage.getItem('defaultDevice');
			if(check !== null)
				null;
			
			const jsonValue = JSON.stringify(device);
			await AsyncStorage.setItem('defaultDevice', jsonValue);
		}
		catch(error) {
			error.log('Connecting to device -> saveDevice(): ', error);
		}
	}

	useEffect(() => {
		if(device !== null){
			setChosenDevice(device);
			handleConnect();
		}
	}, [device])

    return (
        <PopUpWithButton text={chosenDevice !== null ? `Connecting to ${device._nativeDevice?.name}` : null} 
                        buttonText='cancel'
                        visible={chosenDevice !== null ? true : false}
                        onPress={() => handleOnCancel()}/>
    )
}

export default ConnectingToDevice

//to do:
//handle multiple connections attemp with onError() function
//find a way to cancel connection