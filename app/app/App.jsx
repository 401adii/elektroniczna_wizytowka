import '../global.css'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TestView from './TestView';
import DeviceSelection from './screens_old/DeviceSelection';
import MainEditor from './screens_old/MainEditor';
import CredentialsEditor from './screens_old/CredentialsEditor';
import ScheduleEditor from './screens_old/ScheduleEditor';
import QRCodeEditor from './screens_old/QRCodeEditor';
import Menu from './screens/Menu';
import Connect from './screens/Connect'
import Credentials from './screens/Credentials'

export default function App() {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator animationTypeForReplace='push' initialRouteName='Menu'>
        {/* <Stack.Screen name='test' component={TestView}/>
        <Stack.Screen name='DeviceSelection' options={{title: 'Connect to a device'}} component={DeviceSelection}/>
        <Stack.Screen name='MainEditor' options={{title: 'Choose screens'}} component={MainEditor} initialParams={{
          credentialsData: ""
        }}/>
        <Stack.Screen name='CredentialsEditor' options={{title: 'Edit credentials'}} component={CredentialsEditor}/>
        <Stack.Screen name='ScheduleEditor' options={{title: 'Edit schedule'}} component={ScheduleEditor}/>
        <Stack.Screen name='QRCodeEditor' options={{title: 'Edit QR codes'}} component={QRCodeEditor}/> */}
        <Stack.Screen 
        name='Menu' 
        options={{title: "Main Menu"}} 
        component={Menu} 
        initialParams={{credentialsParam: ""}}/>
        <Stack.Screen 
        name='Credentials' 
        options={{title: "Edit Credentials"}} 
        component={Credentials}/>
        <Stack.Screen
        name='Connect'
        options={{title: "Choose Device"}}
        component={Connect}
        initialParams={{data: ""}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


