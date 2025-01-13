import { View, Text } from 'react-native'
import React from 'react'
import Button from './components/Button'

const TestView = () => {

  const buttonTest = () => {
    console.log('buttonPressed');
  }
``
  return (
    <View className='flex-1 items-center justify-center'>
      <Button text='CLICK ME' onPress={() => buttonTest()}/>
    </View>
  )
}

export default TestView