import { Text, View, TextInput, Alert, Button } from 'react-native'
import React from 'react'
import { useState } from 'react';

const Input = () => {

    const [text, setText] = useState("");
    



    return (
        <View className="flex-1 bg-gray-900 items-center justify-center"> 
            <Text className="m-1 text-stone-200 font-bold">Enter your name</Text>
            <TextInput className="m-4 bg-gray-200 w-1/2 h-1/8 p-4 rounded" onChangeText={setText} value={text}/>
            <Button className="m-4 p-4 rounded" onPress={() => setText("")} title="SEND DATA"/>
        </View>
    )

}

export default Input
