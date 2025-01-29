import { View, Text } from 'react-native'
import React,{useState, useEffect} from 'react'
import Button from '../components/Button';
import Input from '../components/Input';

const CredentialsEditor = ({navigation}) => {

    const [data, setData] = useState({});

    const handleChange = (key, value) => {
        setData((prevData) => ({
            ...prevData, [key]:value,
        }));
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
            <Text className='text-center'>Text 3</Text>
            <Input onChange={(value) => handleChange(4, value)}/>
        </View>
        <Button text='confirm' onPress={() => navigation.navigate('ChoiceScreen',
            {
                newData: data
            }
        )}/>
    </View>
  )
}

export default CredentialsEditor