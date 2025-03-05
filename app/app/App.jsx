import '../global.css'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TestView from './TestView';
import DeviceSelection from './screens/DeviceSelection';
import MainEditor from './screens/MainEditor';
import CredentialsEditor from './screens/CredentialsEditor';

export default function App() {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator animationTypeForReplace='push' initialRouteName='DeviceSelection'>
        <Stack.Screen name='test' component={TestView}/>
        <Stack.Screen name='DeviceSelection' options={{title: 'Connect to a device'}} component={DeviceSelection}/>
        <Stack.Screen name='MainEditor' options={{title: 'Choose screens'}} component={MainEditor} initialParams={{
          newData: ""
        }}/>
        <Stack.Screen name='CredentialsEditor' options={{title: 'Edit credentials screen'}} component={CredentialsEditor}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


