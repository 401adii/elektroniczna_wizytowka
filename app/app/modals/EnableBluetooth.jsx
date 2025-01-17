import React, {useEffect, useState} from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import PopUpWithButton from '../components/PopUpWithButton'

const EnableBluetooth = ({onEnabled}) => {

	const [btEnabled, setBtEnabled] = useState(null);
	const [visible, setVisible] = useState(false);
	
	const checkBt = async () => {
		try{
			const enabled = await RNBluetoothClassic.isBluetoothEnabled();
			if(enabled !== null)
				setBtEnabled(enabled);
		}
		catch(error){
			console.error('Error in EnableBluetooth component, checkBt()', error);
		}
	}

	const handleEnableBt = async () => {
		try{
			await RNBluetoothClassic.requestBluetoothEnabled();			
			checkBt();
		}
		catch(error){
			console.error('Error in EnableBluetooth component, handleEnableBt()', error);
		}
	}

	useEffect(() =>{
		checkBt();

		const handleOnBtEnabled = (event) =>{
			checkBt();
		};

		const subscription = RNBluetoothClassic.onStateChanged(handleOnBtEnabled);
		
		return () => {
			subscription.remove();
		}

	},[])

	useEffect(() => {
		if(btEnabled !== null)
			setVisible(!btEnabled);
		if(btEnabled === true)
				onEnabled();
	}, [btEnabled])

	return (
		<PopUpWithButton text='App requires enabling Bluetooth to continue' 
		buttonText='enable bluetooth' 
		onPress={() => handleEnableBt()} 
		visible={visible}/>
	)
}

export default EnableBluetooth