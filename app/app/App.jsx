import '../global.css'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Menu from './screens/Menu';
import Connect from './screens/Connect'
import Credentials from './screens/Credentials'
import QRCodes from './screens/QRCodes'
import Schedule from './screens/Schedule';
import SchedulePrototype from './prototypes/SchedulePrototype';

export default function App() {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator animationTypeForReplace='push' initialRouteName='Menu'>
        <Stack.Screen 
        name='Menu' 
        options={{title: "Main Menu"}} 
        component={Menu} 
        initialParams={{credentialsParam: "", QRParam: ""}}/>
        <Stack.Screen 
        name='Credentials' 
        options={{title: "Edit Credentials"}} 
        component={Credentials}/>
        <Stack.Screen
        name='Connect'
        options={{title: "Choose Device"}}
        component={Connect}
        initialParams={{data: ""}}/>
        <Stack.Screen
        name='QRCodes'
        options={{title: "Edit QR Codes"}}
        component={QRCodes}
        initialParams={{data : ""}}/>
        <Stack.Screen
        name='Schedule'
        options={{title: "Edit Schedule"}}
        component={Schedule}
        initialParams={{data : ""}}/>
        <Stack.Screen
        name='Prototype'
        component={SchedulePrototype}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


