import { View, Text, TouchableNativeFeedback} from 'react-native'
import React from 'react'

const Button = ({text, onPress}) => {
  return (
    <TouchableNativeFeedback onPress={onPress} background={TouchableNativeFeedback.Ripple('rgb(255,178,102)')}>
      <View className='bg-orange-500 rounded p-2 w-1/2' style={{elevation: 2}}>
        <Text className='text-white text-center'>{text.toUpperCase()}</Text>
      </View>
    </TouchableNativeFeedback>
  )
}

export default Button