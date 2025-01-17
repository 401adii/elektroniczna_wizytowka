import {PermissionsAndroid } from 'react-native'
import React, {useState, useEffect} from 'react'
import PopUpWithButton from '../components/PopUpWithButton'

const RequestPermission = ({onPermissionGranted}) => {

	const [visible, setVisible] = useState(false);
	const [granted, setGranted] = useState(null);

	const checkPermissions = async () => {
		try{
			const permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
			if(permission !== null)
				setGranted(permission);
		}
		catch(error){
			console.error('Error in RequestPermission, checkPermission()', error);
		}
	}

    const requestPermission = async () => {
		try {
			const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
			console.log(permission)
			if(permission === true)
				onPermissionGranted();
		}
		catch (error){
			console.error('Error in RequestPermission, requestPermission()', error);
		}
    }

	useEffect(() => {
		checkPermissions();
	}, [])

	useEffect(() => {
		if(granted !== null)
			setVisible(!granted)
		if(granted === true)
			onPermissionGranted();
	},[granted])

  return (
	<PopUpWithButton text='App requires permission for Bluetooth connection' 
					buttonText='request permission' 
					onPress={() => requestPermission()}
					visible={visible}/>
	)
}

export default RequestPermission