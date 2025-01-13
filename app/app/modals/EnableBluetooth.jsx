import { View, Text, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import PopUpWithButton from '../components/PopUpWithButton'

const EnableBluetooth = () => {

	const [visible, setVisible] = useState(false);

	const handleBtStateChanged = (state) => {
		const isVisible = !state?.enabled
		setVisible(isVisible)
	}

	const handleOnPress = () => {
		RNBluetoothClassic.requestBluetoothEnabled();
	}
	
	useEffect(() => {
		const subscription = RNBluetoothClassic.onStateChanged((state) => handleBtStateChanged(state)
		);
	
		return () => {
		  subscription.remove();
		};
	  }, []);

	return (
		<PopUpWithButton text='App requires enabling Bluetooth to continue' buttonText='enable bluetooth' onPress={() => handleOnPress()} visible={visible}/>
	)
}

export default EnableBluetooth