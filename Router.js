import React, {useEffect, useState} from 'react';
import Login from './screens/Login';
import Chat from './screens/Chat';
import {TouchableOpacity, Text} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Register from './screens/Register';
import Home from './screens/Home';
import {auth} from './firebaseSvc';
import Room from './screens/Room';
import RoomHome from './screens/RoomHome';
import CreateRoom from './screens/CreateRoom';
import firestore from '@react-native-firebase/firestore';
import {Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();

const Router = ({navigation}) => {
  const [users, setUsers] = useState('');
 
  const login = useSelector(state => state.loginReducer);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userExist => {
      if (userExist) {
        setUsers(userExist);
        firestore().collection('users').doc(userExist.uid).update({
          status: 'online',
        });
      } else setUsers('');
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const logOut =  () => {
    firestore().collection('users').doc(login?.loginKey).update({
      status: firestore.FieldValue.serverTimestamp(),
    });
    auth.signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => {
        console.log(error);
      });
  };
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
        <Stack.Screen
          name="Home"
          component={Home}
          // options={{
          //   headerRight: () => (
          //     <Button onPress={logOut} title="logOut" color="black" />
          //   ),
          // }}
        />

        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({route}) => ({
            title: route.params.name,
            user: 'users',
          })}></Stack.Screen>
        <Stack.Screen name="Room" component={Room} />
        <Stack.Screen
          name="RoomHome"
          component={RoomHome}
          options={({route}) => ({title: route.params.name})}
        />
        <Stack.Screen name="CreateRoom" component={CreateRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
