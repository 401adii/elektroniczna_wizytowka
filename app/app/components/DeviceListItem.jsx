import { View, Text, TouchableNativeFeedback } from 'react-native'
import React from 'react'

const DeviceListItem = ({deviceName, deviceAdress, onPress}) => {

  const handleOnPress = () => {
    onPress();
  }

  return (
    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('rgb(200,200,200)')} onPress={() => handleOnPress()}>
      <View>
        <View className='px-2 py-4'>
            <Text className='text-lg font-bold'>{deviceName}</Text>
            <Text>{deviceAdress}</Text>
        </View>
        <View className='border border-gray-300 rounded'></View>
      </View>
    </TouchableNativeFeedback>
  )
}

export default DeviceListItem