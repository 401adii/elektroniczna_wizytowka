import { View, Text, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import PopUpWithButton from '../components/PopUpWithButton'

const EnableBluetooth = ({onEnabled}) => {

	const [visible, setVisible] = useState(true);

	const handleBtStateChanged = (state) => {
		const isVisible = !state?.enabled
		setVisible(isVisible)
	}

	const checkIsEnabled = async () => {
		try{
			const enabled = await RNBluetoothClassic.isBluetoothEnabled();
			setVisible(!enabled);
		}
		catch(error){
			console.error(error);
		}
	}

	const handleOnPress = () => {
		RNBluetoothClassic.requestBluetoothEnabled();
	}

	useEffect(() =>{
		checkIsEnabled()
	}, [])
	
	useEffect(() => {
		const subscription = RNBluetoothClassic.onStateChanged((state) => handleBtStateChanged(state)
		);
	
		return () => {
		  subscription.remove();
		};
	  }, []);

	useEffect(() => {
		if(!visible)
			onEnabled();
	},[visible])

	return (
		<PopUpWithButton text='App requires enabling Bluetooth to continue' buttonText='enable bluetooth' onPress={() => handleOnPress()} visible={visible}/>
	)
}

export default EnableBluetooth