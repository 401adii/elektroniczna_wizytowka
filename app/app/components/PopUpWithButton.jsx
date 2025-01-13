import { View, Text, Modal} from 'react-native'
import React from 'react'
import Button from './Button'

const PopUpWithButton = ({text, buttonText, onPress, visible}) => {
  return (
		<Modal transparent={true} visible={visible} animationType='fade'>
			<View className='flex-1 items-center justify-center bg-[rgba(0,0,0,0.2)]'>
				<View className='rounded items-center justify-center bg-white p-4 w-5/6 h-1/6' style={{elevation: 2}}>
					<View className='flex-1 justify-start'>
						<Text className='text-center'>{text}</Text>
					</View>
					<Button onPress={onPress} text={buttonText.toUpperCase()}/>
				</View>
		</View>
	</Modal>
  )
}

export default PopUpWithButton