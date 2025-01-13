import { View, Text, Modal, PermissionsAndroid } from 'react-native'
import React, {useState} from 'react'
import Button from '../components/Button'

const RequestPermission = ({onPermissionGranted}) => {

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
		<Modal transparent={true}>
			<View className='flex-1 items-center justify-center bg-[rgba(0,0,0,0.2)]'>
				<View className='rounded items-center justify-center bg-white p-4 w-5/6 h-1/6' style={{elevation: 2}}>
					<View className='flex-1 justify-start'>
						<Text className='text-center'>App requires Bluetooth connection permission to work correctly.</Text>
					</View>
					<Button onPress={() => requestPermission()} text='REQUEST PERMISSION'/>
				</View>
			</View>
		</Modal>
	)
}

export default RequestPermission