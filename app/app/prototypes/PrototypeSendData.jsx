import { View, Text, TextInput, TouchableHighlight } from 'react-native'
import React, {useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


const PrototypeSendData = ({navigation}) => {
  const [text, setText] = useState('');
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSendData = async () => {
    if(text === '')
      return;
    
    try{
      await AsyncStorage.setItem('data', text);
      setSaveStatus(true);
      setText('');
    }
    catch(error){
      console.error('Error while saving data to send:', error);
    }
  }

  useEffect(() => {
    if(saveStatus === true){
      navigation.navigate('Connect');
      setSaveStatus(false);
    }
  }, [saveStatus])
  
  return (
    <View className='flex-1 items-center justify-center p-2 gap-2'>
      <Text>Input string to send</Text>
      <TextInput className='min-w-32 border rounded p-1' onChangeText={setText} value={text}/>
      <TouchableHighlight className='bg-orange-500 rounded p-2' underlayColor='lightsalmon'
                          onPress={() => handleSendData()}>
        <Text className='text-white'>SEND DATA</Text>
      </TouchableHighlight>
      <TouchableHighlight className='bg-orange-500 rounded p-2' underlayColor='lightsalmon'
                          onPress={() => navigation.navigate('Connect')}>
        <Text className='text-white'>NAVIGATE</Text>
      </TouchableHighlight>
    </View>
  )
}

export default PrototypeSendData