import { View, Text } from 'react-native'
import React, {useState} from 'react'
import Button from '../components/Button';
import Input from '../components/Input';

const CLEAR_STR = 'clear_screen0:1\n\r';

const Credentials = ({navigation, route}) => {
    const [data, setData] = useState({});
    const [clear, setClear] = useState(false);

    const handleChange = (key, value) => {
        setData((prevData) => ({
            ...prevData, [key]:value,
        }));
    }


    const parseData = () => {
        const entries = Object.entries(data);

        const formatted = entries.map(([key, value]) => {
        const formattedKey = `${0}${key}`.padStart(2, '0');
        return `${formattedKey}:${String(value).replace(/"/g, '')}`;
        });
        return formatted.join('\n') + '\n\r';
  }

  return (
    <View className='flex-1 gap-4 items-center justify-center pb-80'>
        <View className='items-center'>
            <Text className='text-center'>Text 1</Text>
            <Input onChange={(value) => handleChange(1, value)}/>
        </View>
        <View className='items-center'>
            <Text className='text-center'>Text 2</Text>
            <Input onChange={(value) => handleChange(2, value)}/>
        </View>
        <View className='items-center'>
            <Text className='text-center'>Text 3</Text>
            <Input onChange={(value) => handleChange(3, value)}/>
        </View>
        <View className='items-center'>
            <Text className='text-center'>Text 4</Text>
            <Input onChange={(value) => handleChange(4, value)}/>
        </View>
        <Button text={`clear data: ${clear ? 'yes' : 'no'}`} onPress={() => setClear(!clear)}/>
        <Button text='confirm' onPress={() =>{
            const flag = (clear ? CLEAR_STR : '');
            const parsed = parseData();
            const data = flag + parsed;
            console.log(data);
            if (route.params?.onConfirm) {
            route.params.onConfirm(data);
            }
            navigation.goBack(); 
        } }/>
    </View>
  )
}

export default Credentials