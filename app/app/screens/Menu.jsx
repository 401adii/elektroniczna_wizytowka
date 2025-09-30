import { View } from 'react-native'
import React, {useEffect, useCallback, useState} from 'react'
import Button from '../components/Button'
import { useFocusEffect } from '@react-navigation/native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

const Menu = ({navigation, route}) => {
  
  const [screens, setScreens] = useState({0:1,
                                          1:1,
                                          2:1});
  const [credentials, setCredentials] = useState("");
  const [schedule, setSchedule] = useState("");
  const [QR, setQR] = useState("");




  const updateScreens = (key) => {
    setScreens(prev => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1
    }));
  }
  
  const parseScreensData = (screensData) => {
    const formatted = Object.entries(screens)
    .map(([key, value]) => `${key}:${String(value).replace(/"/g, '')}`) 
    .join('\n'); 
  
    return formatted + '\n\r';
  }

  const handleSendData = () => {
    const data = [];
    const screensData = parseScreensData(JSON.stringify(screens));
    data.push(screensData);
    if(credentials !== ""){
      data.push(credentials);
    }
    if(QR !== ""){
      data.push(QR);
    }
    if(schedule !== ""){
      data.push(schedule)
    }
      
    console.log(data);
    navigation.navigate('Connect', {
      data: data
    })
  }

  return (
    <View className='flex-1 items-center justify-center gap-4'>
      <View className='flex-row gap-1'>
        <Button text='Credentials' onPress={() => navigation.navigate('Credentials', { onConfirm: (data) => setCredentials(data) })}/>
        <BouncyCheckbox isChecked={screens[0]} fillColor='rgb(255, 105, 0)' onPress={() => updateScreens(0)}/>  
      </View>
      <View className='flex-row gap-1'>
        <Button text='Schedule' onPress={() => {navigation.navigate('Schedule', {onConfirm: (data) => setSchedule(data)})}}/>
        <BouncyCheckbox isChecked={screens[1]} fillColor='rgb(255, 105, 0)' onPress={() => updateScreens(1)}/>  
      </View>
      <View className='flex-row gap-1'>
        <Button text='QR Codes' onPress={() => navigation.navigate('QRCodes', {onConfirm: (data) => setQR(data)})}/>
        <BouncyCheckbox isChecked={screens[2]} fillColor='rgb(255, 105, 0)' onPress={() => updateScreens(2)}/>  
      </View>
      <Button onPress={() => handleSendData()} text='send data'/>
    </View>
  )
}

export default Menu