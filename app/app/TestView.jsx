import { View } from 'react-native'
import React, {useState} from 'react'
import EnableBluetooth from './modals/EnableBluetooth'
import RequestPermission from './modals/RequestPermission'
import Button from './components/Button'

const TestView = ({navigation}) => {

  const [trigger, setTrigger] = useState(false);
  
  const handleTrigger = () => {
    setTrigger(true);
  }

  const handleOnEnabled = () => {
    setTrigger(false);
  }
  
  return (
    <View className='flex-1 items-center justify-center'>
      {trigger ? <RequestPermission onPermissionGranted={() => handleOnEnabled()}/> : null}
      <Button text='trigger' onPress={() => handleTrigger()}/>
    </View>
  )
}

export default TestView