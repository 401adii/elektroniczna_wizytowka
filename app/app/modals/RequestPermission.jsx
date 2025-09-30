import {PermissionsAndroid } from 'react-native'
import React, {useState, useEffect} from 'react'
import PopUpWithButton from '../components/PopUpWithButton'

const RequestPermission = () => {

	const [visible, setVisible] = useState(false);
	const [granted, setGranted] = useState(null);

	const checkPermissions = async () => {
		try{
			const permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
			if(permission !== null){
				setGranted(permission);
			}
		}
		catch(error){
			console.error('Error in RequestPermission, checkPermission()', error);
		}
	}

    const requestPermission = async () => {
		try {
			const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
			console.log(permission);
			if(permission === PermissionsAndroid.RESULTS.GRANTED){
				setGranted(true);
			}
		}
		catch (error){
			console.error('Error in RequestPermission, requestPermission()', error);
		}
    }

	useEffect(() => {
		checkPermissions();
	}, [])

	useEffect(() => {
		if(granted !== null){
			setVisible(!granted)
		}
	},[granted])

  return (
	<PopUpWithButton text='App requires permission for Bluetooth connection' 
					buttonText='request permission' 
					onPress={() => requestPermission()}
					visible={visible}/>
	)
}

export default RequestPermission