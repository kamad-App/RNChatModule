import React from 'react';
import Login from './screens/Login';
import Chat from './screens/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './screens/Register';
const Stack = createNativeStackNavigator();

const App=()=>{ 
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;