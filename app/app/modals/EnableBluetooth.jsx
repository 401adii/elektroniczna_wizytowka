import { View, Text, Modal } from 'react-native'
import React from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import PopUpWithButton from '../components/PopUpWithButton'

const EnableBluetooth = () => {

    const handleOnPress = () => {
        RNBluetoothClassic.openBluetoothSettings();
    }

    return (
        <PopUpWithButton text='App requires enabling Bluetooth to continue' buttonText='go to settings' onPress={() => handleOnPress()}/>
	)
}

export default EnableBluetooth