import { View, Text } from 'react-native'
import React from 'react'
import Button from './components/Button'
import RNBluetoothClassic from 'react-native-bluetooth-classic'

const TestView = ({navigation}) => {

  const buttonTest = () => {
    navigation.navigate('Send Data');
  }

  return (
    <View className='flex-1 items-center justify-center'>
      <Button text='CLICK ME' onPress={() => RNBluetoothClassic.openBluetoothSettings()}/>
    </View>
  )
}

export default TestView