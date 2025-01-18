import { ToastAndroid } from 'react-native'
import React, {useRef, useEffect} from 'react'
import PopUpWithButton from '../components/PopUpWithButton'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ConnectingToDevice = ({device, onConnected, onCancel}) => {

	const cancelledRef = useRef(false);

	const handleOnCancel = () => {
		onCancel();
		cancelledRef.current = true;
	}

	const handleConnect = async () => {
		try {
			const connected = await device.connect({useExternal: true});
			if(connected === true){
				handleOnConnected();
			}
		}
		catch(error) {
			error.log('Connecting to device -> handleConnect(): ', error);
		}
	}

	const handleOnConnected = () => {
		if(cancelledRef.current === false){
			onConnected();
			saveDevice();
			ToastAndroid.showWithGravity('Connected succesfully!',
				ToastAndroid.SHORT,
				ToastAndroid.BOTTOM)
		}
		else {
			disconnect();
			cancelledRef.current = false
		}
	}

	const disconnect = async () => {
		try {
			await device.disconnect();
		}
		catch(error) {
			error.log('Connecting to device -> disconnect(): ', error);
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
			handleConnect();
			cancelledRef.current = false
		}
	}, [device])

    return (
        <PopUpWithButton text={device !== null ? `Connecting to ${device._nativeDevice?.name}` : null} 
                        buttonText='cancel'
                        visible={device !== null ? true : false}
                        onPress={() => handleOnCancel()}/>
    )
}

export default ConnectingToDevice