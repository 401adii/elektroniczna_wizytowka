import '../global.css'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import PrototypeSendData from './prototypes/PrototypeSendData';
import PrototypeConnect from './prototypes/PrototypeConnect';
import TestView from './TestView';
import ConnectionScreen from './screens/ConnectionScreen';

export default function App() {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator animationTypeForReplace='push' initialRouteName='ConnectionScreen'>
        <Stack.Screen name='Test View' component={TestView}/>
        <Stack.Screen name='ConnectionScreen' options={{title: 'Connect to a device'}} component={ConnectionScreen}/>
        <Stack.Screen name='Send Data' component={PrototypeSendData}/>
        <Stack.Screen name='Connect' component={PrototypeConnect}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


