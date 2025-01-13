import { View, Text, Modal, PermissionsAndroid } from 'react-native'
import React, {useState} from 'react'
import PopUpWithButton from '../components/PopUpWithButton'

const RequestPermission = ({onPermissionGranted, visible}) => {

    const requestPermission = async () => {
			try {
				const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
				if(permission)
					onPermissionGranted();
			}
			catch (error){
				console.error(error);
			}
    }

  return (
	<PopUpWithButton text='App requires permission for Bluetooth connection' buttonText='request permission' onPress={() => requestPermission()} visible={visible}/>
	)
}

export default RequestPermission