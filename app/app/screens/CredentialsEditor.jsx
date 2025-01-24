import { View, Text } from 'react-native'
import React,{useState} from 'react'
import Button from '../components/Button';
import Input from '../components/Input';

const CredentialsEditor = () => {

    const [data, setData] = useState({1 : "test",
                                      2 : "test2",
                                      3 : "test3"});

    const handleChange = (key, value) => {
        setData((prevData) => ({
            ...prevData, [key]:value,
        }));
        console.log(data);
    }


  return (
    <View className='flex-1 gap-4 items-center justify-center pb-80'>
        <View className='items-center'>
            <Text className='text-center'>Text 1</Text>
            <Input onChange={(value) => handleChange(1, value)}/>
        </View>
        <View className='items-center'>
            <Text className='text-center'>Text 2</Text>
            <Input/>
        </View>
        <View className='items-center'>
            <Text className='text-center'>Text 3</Text>
            <Input/>
        </View>
    </View>
  )
}

export default CredentialsEditor