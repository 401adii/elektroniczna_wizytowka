import { View } from 'react-native'
import React, {useEffect, useCallback, useState} from 'react'
import Button from '../components/Button'
import { useFocusEffect } from '@react-navigation/native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

const Menu = () => {

  const [screens, setScreens] = useState({0:0,
                                          1:0,
                                          2:0});

  const [data, setData] = useState([]);


  const updateScreens = (key) => {
    setScreens(prev => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1
    }));
  }
  
  const parseScreensData = (screensData) => {
    const obj = JSON.parse(screensData);
    const formatted = Object.entries(obj)
    .map(([key, value]) => `${key}:${String(value).replace(/"/g, '')}`) 
    .join('\n'); 
  
    return formatted + '\n\r';
  }

  const handleSendData = () => {
    const newData = [];
    const screensData = parseScreensData(JSON.stringify(screens));
    newData.push(screensData);
    
    setData(newData);
    console.log(newData);
  }


  return (
    <View className='flex-1 items-center justify-center gap-4'>
      <View className='flex-row gap-1'>
        <Button text='Credentials' onPress={() => {}}/>
        <BouncyCheckbox fillColor='rgb(255, 105, 0)' onPress={() => updateScreens(0)}/>  
      </View>
      <View className='flex-row gap-1'>
        <Button text='Schedule' onPress={() => {}}/>
        <BouncyCheckbox fillColor='rgb(255, 105, 0)' onPress={() => updateScreens(1)}/>  
      </View>
      <View className='flex-row gap-1'>
        <Button text='QR Codes' onPress={() => {}}/>
        <BouncyCheckbox fillColor='rgb(255, 105, 0)' onPress={() => updateScreens(2)}/>  
      </View>
      <Button onPress={() => handleSendData()} text='send data'/>
    </View>
  )
}

export default Menu