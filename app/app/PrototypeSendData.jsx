import { View, Text, TextInput, TouchableHighlight } from 'react-native'
import React, {useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const PrototypeSendData = () => {
  const [text, setText] = useState('');

  const handleSendData = async () => {
    try{
      await AsyncStorage.setItem('data', text);
      setText('data');
    }
    catch(error){
      console.error('Error while saving data to send:', error);
    }
  }
  
  return (
    <View className='flex-1 items-center justify-center p-2 gap-2'>
      <Text>Input string to send</Text>
      <TextInput className='min-w-32 border rounded p-1' onChangeText={setText} value={text}/>
      <TouchableHighlight className='bg-orange-500 rounded p-2' underlayColor='lightsalmon'
                          onPress={() => handleSendData()}>
        <Text className='text-white'>SEND DATA</Text>
      </TouchableHighlight>
    </View>
  )
}

export default PrototypeSendData