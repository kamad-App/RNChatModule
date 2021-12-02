import React, {useEffect, useState} from 'react';
import Login from './screens/Login';
import Chat from './screens/Chat';
import {TouchableOpacity, Text} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Register from './screens/Register';
import Home from './screens/Home';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator();

const App = () => {
  const [users, setUsers] = useState('');
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(userExist => {
      if (userExist) setUsers(userExist);
      else setUsers('');
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
       

        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
         <Stack.Screen name="Home" component={Home}>
          {/* {props => <Home {...props} user={user} />} */}
        </Stack.Screen>

        <Stack.Screen
          name="Chat"
          component={Chat}
           options={({route}) => ({title: route.params.name,user: 'users'})}
          >
          {/* {props => <Chat {...props} user={user} />} */}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
