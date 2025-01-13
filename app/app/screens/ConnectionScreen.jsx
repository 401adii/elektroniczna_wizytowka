import { View, Text, PermissionsAndroid } from 'react-native'
import React, {useState, useEffect} from 'react'
import RequestPermission from '../modals/RequestPermission';

const ConnectionScreen = () => {

  const [permissionGranted, setPermissionGranted] = useState(false);

  const checkPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      setPermissionGranted(granted);
    }
    catch(error) {
      console.error(error);
    }
  }

  const handlePermissionGranted = () => {
    setPermissionGranted(true);
  }

  useEffect(() =>{
    checkPermission();
  }, [permissionGranted])

  return (
    <View>
      {!permissionGranted ? <RequestPermission onPermissionGranted={() => handlePermissionGranted()}/> : null}
      <Text>connection screen</Text>
    </View>
  )
}

export default ConnectionScreen