import { TextInput } from 'react-native'
import React, { useState } from 'react'

const Input = ({onChange = (val) => {}}) => {

    const [value, setValue] = useState("");

    const handleChange = (val) => {
        setValue(val);
        onChange(val);
    }
    
    return (
        <TextInput className='border rounded border-gray-400 p-2 w-48' 
                    onChangeText={(val) => handleChange(val)}
                    value={value}/>
    )
}

export default Input