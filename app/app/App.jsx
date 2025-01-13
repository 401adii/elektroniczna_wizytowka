import '../global.css'
import PrototypeSendData from './PrototypeSendData';
import PrototypeConnect from './PrototypeConnect';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestView from './TestView';

export default function App() {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator animationTypeForReplace='push'>
        <Stack.Screen name='Test View' component={TestView}/>
        {/* <Stack.Screen name='SendData' component={PrototypeSendData}/>
        <Stack.Screen name='Connect' component={PrototypeConnect}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


