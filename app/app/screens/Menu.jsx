import { View } from 'react-native'
import React, {useEffect, useCallback, useState} from 'react'
import Button from '../components/Button'
import { useFocusEffect } from '@react-navigation/native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

const Menu = ({navigation, route}) => {
  
  const {credentialsParam} = route.params
  const [screens, setScreens] = useState({0:1,
                                          1:1,
                                          2:1});




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

  const parseCredentialsData = (credentialsData) => {
    const obj = JSON.parse(credentialsData);
    const entries = Object.entries(obj);

    const formatted = entries.map(([key, value]) => {
      const formattedKey = `${0}${key}`.padStart(2, '0');
      return `${formattedKey}:${String(value).replace(/"/g, '')}`;
    });

    return formatted.join('\n') + '\n\r';
  }

  const handleSendData = () => {
    const data = [];
    const screensData = parseScreensData(JSON.stringify(screens));
    data.push(screensData);
    if(credentialsParam !== ""){
      const credentialsData = parseCredentialsData(JSON.stringify(credentialsParam));
      data.push(credentialsData);
    }
    
    console.log(data);
    navigation.navigate('Connect', {
      data: data
    })
  }


  return (
    <View className='flex-1 items-center justify-center gap-4'>
      <View className='flex-row gap-1'>
        <Button text='Credentials' onPress={() => navigation.navigate('Credentials')}/>
        <BouncyCheckbox isChecked={screens[0]} fillColor='rgb(255, 105, 0)' onPress={() => updateScreens(0)}/>  
      </View>
      <View className='flex-row gap-1'>
        <Button text='Schedule' onPress={() => {}}/>
        <BouncyCheckbox isChecked={screens[1]} fillColor='rgb(255, 105, 0)' onPress={() => updateScreens(1)}/>  
      </View>
      <View className='flex-row gap-1'>
        <Button text='QR Codes' onPress={() => {}}/>
        <BouncyCheckbox isChecked={screens[2]} fillColor='rgb(255, 105, 0)' onPress={() => updateScreens(2)}/>  
      </View>
      <Button onPress={() => handleSendData()} text='send data'/>
    </View>
  )
}

export default Menu