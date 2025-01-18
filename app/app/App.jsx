import '../global.css'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TestView from './TestView';
import ConnectionScreen from './screens/ConnectionScreen';
import ChoiceScreen from './screens/ChoiceScreen';

export default function App() {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator animationTypeForReplace='push' initialRouteName='test'>
        <Stack.Screen name='test' component={TestView}/>
        <Stack.Screen name='ConnectionScreen' options={{title: 'Connect to a device'}} component={ConnectionScreen}/>
        <Stack.Screen name='ChoiceScreen' options={{title: 'Choose screens'}} component={ChoiceScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


