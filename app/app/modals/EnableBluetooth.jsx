import { PermissionsAndroid } from 'react-native'
import React, {useEffect, useState} from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import PopUpWithButton from '../components/PopUpWithButton'

const EnableBluetooth = ({onEnabled, overrideVisible}) => {

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

	useEffect(() =>{
		checkIsEnabled();
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
		<PopUpWithButton text='App requires enabling Bluetooth to continue' 
		buttonText='enable bluetooth' 
		onPress={() => RNBluetoothClassic.requestBluetoothEnabled()} 
		visible={overrideVisible !== true || null ? overrideVisible : visible}/>
	)
}

export default EnableBluetooth