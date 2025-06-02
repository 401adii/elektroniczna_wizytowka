import '../global.css'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// import TestView from './TestView';
// import DeviceSelection from './screens/DeviceSelection';
// import MainEditor from './screens/MainEditor';
// import CredentialsEditor from './screens/CredentialsEditor';
// import ScheduleEditor from './screens/ScheduleEditor';
// import QRCodeEditor from './screens/QRCodeEditor';
import Menu from './screens/Menu';

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
        <Stack.Screen name='Menu' options={{title: "Main Menu"}} component={Menu}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


