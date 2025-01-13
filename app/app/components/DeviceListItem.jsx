import { View, Text, TouchableNativeFeedback } from 'react-native'
import React from 'react'

const DeviceListItem = ({deviceName, deviceAdress}) => {
  return (
    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('rgb(200,200,200)')}>
        <View className='p-2 pb-4'>
            <Text className='text-lg font-bold'>{deviceName}</Text>
            <Text>{deviceAdress}</Text>
        </View>
    </TouchableNativeFeedback>
  )
}

export default DeviceListItem