import '../global.css'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TestView from './TestView';
import ConnectionScreen from './screens/ConnectionScreen';
import ChoiceScreen from './screens/ChoiceScreen';
import CredentialsEditor from './screens/CredentialsEditor';

export default function App() {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator animationTypeForReplace='push' initialRouteName='ConnectionScreen'>
        <Stack.Screen name='test' component={TestView}/>
        <Stack.Screen name='ConnectionScreen' options={{title: 'Connect to a device'}} component={ConnectionScreen}/>
        <Stack.Screen name='ChoiceScreen' options={{title: 'Choose screens'}} component={ChoiceScreen} initialParams={{
          newData: ""
        }}/>
        <Stack.Screen name='CredentialsEditor' options={{title: 'Edit credentials screen'}} component={CredentialsEditor}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


