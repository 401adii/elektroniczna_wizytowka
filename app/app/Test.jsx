import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import RNBluetoothClassic, { BluetoothDevice} from 'react-native-bluetooth-classic'

const Test = () => {

  const [pairedDevices, setPairedDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  async function handleStuff(){
    try{
      const bondedDevices = await RNBluetoothClassic.getBondedDevices();
      if (isMounted.current) 
        setPairedDevices(bondedDevices);
    }
    catch(error){
      console.error(error);
    }
  }

  async function handleConnection(item){
    try {
      if (!item) {
        console.error("Device information is missing.");
        return;
      }
  
      let connection = await item.isConnected(); // Check if already connected
      if (!connection) {
        const connectionOptions = {
          DELIMITER: '\n', // Example: Define your delimiter
        };
        connection = await item.connect(connectionOptions); // Attempt to connect
      }
  
      if (connection) {
        console.log(`Connected to ${item._nativeDevice?.id || 'Unknown Device'}`);
        setConnectedDevice(item);
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  }

  async function sendDataToDevice(device, data) {
    try {
      // Check if the device is connected
      const isConnected = await device.isConnected();
      if (!isConnected) {
        console.error('Device is not connected. Please connect first.');
        return;
      }
  
      // Write data to the device
      const success = await device.write(data, 'utf-8'); // 'utf-8' encoding for string data
  
      if (success) {
        console.log(`Data "${data}" sent successfully to ${device.name || 'Unknown Device'}`);
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error while sending data:', error);
    }
  }

  return (
    <View className="flex-1 items-center justify-center w-1/4">
      <TouchableOpacity className="bg-blue-400 p-2 rounded" onPress={() => handleStuff()}>
          <Text className="text-center text-white">DO STUFF</Text>
      </TouchableOpacity>
      <ScrollView className="mt-4 w-full">
        {pairedDevices.length > 0 ? (
          <FlatList
            data={pairedDevices}
            renderItem={({ item }) => (
              <TouchableOpacity className="bg-gray-200 p-2 m-2 rounded"
                                onPress={() => handleConnection(item)}>
                <Text>{item._nativeDevice?.name || 'Unknown Device'}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._nativeDevice?.id || item._nativeDevice?.address}
          />
        ) : (
          <Text className="text-gray-500 text-center">No paired devices found</Text>
        )}
      </ScrollView>
      <TouchableOpacity className="bg-blue-400 p-2 rounded" onPress={() => sendDataToDevice(connectedDevice, "Dziala to?")}>
        <Text>SEND DATA</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Test