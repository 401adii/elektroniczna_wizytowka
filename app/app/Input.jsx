import { Text, View, TextInput, Alert, Button } from 'react-native'
import React from 'react'
import { useState } from 'react';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

const Input = () => {

    const [text, setText] = useState("");
    
  console.log(RNBluetoothClassic);
  
  const handleSendData = async () => {
    try {
      // Check if Bluetooth is enabled
      const isEnabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (!isEnabled) {
        Alert.alert("Bluetooth Disabled", "Please enable Bluetooth to send data.");
        return;
      }

      // Logic to send data if Bluetooth is enabled
      Alert.alert("Data Sent", `Data: ${text}`);
      setText(""); // Clear the input field
    } catch (error) {
      Alert.alert("Error", "Failed to check Bluetooth status. Please try again.");
      console.error("Bluetooth check error:", error);
    }
  };

    return (
        <View className="flex-1 bg-gray-900 items-center justify-center"> 
            <Text className="m-1 text-stone-200 font-bold">Enter your name</Text>
            <TextInput className="m-4 bg-gray-200 w-1/2 h-1/8 p-4 rounded" onChangeText={setText} value={text}/>
            <Button className="m-4 p-4 rounded" onPress={handleSendData} title="SEND DATA"/>
        </View>
    )

}

export default Input
