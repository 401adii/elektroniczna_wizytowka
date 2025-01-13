import '../global.css'
import PrototypeSendData from './PrototypeSendData';
import PrototypeConnect from './PrototypeConnect';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator animationTypeForReplace='push'>
        <Stack.Screen name='SendData' component={PrototypeSendData}/>
        <Stack.Screen name='Connect' component={PrototypeConnect}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


