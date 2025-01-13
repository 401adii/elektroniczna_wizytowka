import { View, Text, TouchableHighlight } from 'react-native'
import React from 'react'

const Button = ({text, onPress}) => {
  return (
    <TouchableHighlight className='bg-orange-500 rounded p-2' underlayColor='lightsalmon' onPress={onPress} style={{elevation: 2}}>
        <Text className='text-white text-center'>{text}</Text>
    </TouchableHighlight>
  )
}

export default Button