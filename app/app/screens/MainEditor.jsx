import {View} from 'react-native'
import React, {useEffect, useCallback, useState} from 'react'
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

const MainEditor = ({navigation, route}) => {

  const [activeScreensKey, setActiveScreensKey] = useState("activeScreens");
  //const [credentialsDataKey, setCredentialsDataKey] = useState("credentialsData");
  const [credentialsData, setCredentialsData] = useState("");
  const [activeScreens, setActiveScreens] = useState({0:1,
                                                      1:1,
                                                      2:1})

  const updateActiveScreens = async (key) =>{ //controls the active screens and saves to async storage that hopefully works
    try{
      setActiveScreens(prev => ({
        ...prev,
        [key]: prev[key] === 1 ? 0 : 1
      }));
      const str = JSON.stringify(activeScreens);
      await AsyncStorage.setItem(activeScreensKey, str);
    }
    catch{
      console.error("updateActiveScreens");
    }
    
  }

  const sendData = async () => { //this prepares data to send
    console.log("this data will be send:");
    str = JSON.stringify(activeScreens);
    console.log(convertJsonToScreenData(str));
    str = JSON.stringify(credentialsData);
    console.log(convertJsonToAPI(str, 0));
  }

  const convertJsonToScreenData = (json) => { //converts screen data to correct format for the esp32
    try {
      const obj = JSON.parse(json); // parse JSON string to object
      const formatted = Object.entries(obj)
        .map(([key, value]) => `${key}:${value}`) // format each pair
        .join(','); // join with commas
  
      return formatted + '\n\r'; // add literal \n\r
    } catch (error) {
      console.error('Invalid JSON string:', error);
      return '';
    }
  }

  const convertJsonToAPI = (json, screenNumber) => { //converts screen specific data to correct format for the esp32
    try {
      const obj = JSON.parse(json);
      const entries = Object.entries(obj);
  
      const formatted = entries.map(([key, value]) => {
        const formattedKey = `${screenNumber}${key}`.padStart(2, '0');
        return `${formattedKey}:"${value}"`;
      });
  
      return formatted.join(',') + '\n\r';
    } catch (error) {
      console.error('Invalid JSON:', error);
      return '';
    }
  };

  const addDataToStorage = async (key, str) => { //ads data from screens to async storage
    try{
      const jsonValue = JSON.stringify(str);
      await AsyncStorage.setItem(key, jsonValue);
    }
    catch{
      console.error("addDataToStorage error");
    }
  }
  

  useFocusEffect( //controls data updates from specific screens
    useCallback(() => {
      if(route.params?.credentialsData !== "")
        setCredentialsData(route.params?.credentialsData)
        //addDataToStorage(credentialsDataKey, route.params?.credentialsData);
    },[route.params?.credentialsData])
  )

  const readScreenData = async () => {
    const str = await AsyncStorage.getItem(activeScreensKey);
    const obj = JSON.parse(str);
    setActiveScreens(obj);
    console.log(str);
  }

  useEffect(() => {
    readScreenData(); //executes only on launch
  }, [])

  return (
    <View className='flex-1 items-center justify-center gap-4'>
      <View className='flex-row gap-1'>
        <Button text='Credentials Editor' onPress={() => navigation.navigate('CredentialsEditor')} />
        <BouncyCheckbox fillColor='rgb(255, 105, 0)' onPress={() => updateActiveScreens(0)} isChecked={activeScreens[0] === 1 ? true : false}/>
      </View>
      <View className='flex-row gap-1'>
        <Button onPress={() => navigation.navigate('ScheduleEditor')} text='Schedule Editor'/>
        <BouncyCheckbox fillColor='rgb(255, 105, 0)' onPress={() => updateActiveScreens(1)} isChecked={activeScreens[1] === 1 ? true : false}/>
      </View>
      <View className='flex-row gap-1'>
        <Button onPress={() => navigation.navigate('QRCodeEditor')} text='QR Code Editor'/>
        <BouncyCheckbox fillColor='rgb(255, 105, 0)' onPress={() => updateActiveScreens(2)} isChecked={activeScreens[2] === 1 ? true : false}/>
      </View>
      <Button onPress={() => sendData()} text='send data'/>
    </View>
  )
}

export default MainEditor