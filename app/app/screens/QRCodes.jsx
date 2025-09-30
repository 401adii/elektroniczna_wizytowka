import { View, Text } from 'react-native'
import React, {useState} from 'react'
import QRCode from 'react-native-qrcode-svg'
import Input from '../components/Input'
import Button from '../components/Button'

const QRCodes = ({navigation, route}) => {

  const [QRText1, setQRText1] = useState("");
  const [QRText2, setQRText2] = useState("");
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const parseData = () => {
    return (
      `link1:${QRText1}\n` +
      `tekst1:${text1}\n` +
      `link2:${QRText2}\n` +
      `tekst2:${text2}\n\r`
    );
  }

  return (
    <View className='flex-1 items-center justify-center gap-1'>
      <Text>Link</Text>
      <Input onChange={(value) => setQRText1(value)}/>
      <Text>Text</Text>
      <Input onChange={(value => setText1(value))}/>
      <Text>Preview</Text>
      <QRCode value={QRText1 === "" ? " " : QRText1}/>
      <Text>Link</Text>
      <Input onChange={(value) => setQRText2(value)}/>
      <Text>Text</Text>
      <Input onChange={(value) => setText2(value)}/>
      <Text>Preview</Text>
      <QRCode value={QRText2=== "" ? " " : QRText2}/>
      <Button text='confirm' onPress={() => {
        const parsedData = parseData();
          if (route.params?.onConfirm) {
            route.params.onConfirm(parsedData);
          navigation.goBack();
    }
        }}/>
    </View>
  )
}

export default QRCodes