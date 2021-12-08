import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import {auth} from '../firebaseSvc';
import {Button} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import { LoginAction } from '../redux/action/loginID';

const {width, height} = Dimensions.get('screen');

const Login = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [avatar, setAvatar] = useState('');

  const dispatch=useDispatch();

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Add the Fields');
    } else {
      const result = await auth?.signInWithEmailAndPassword(email, password);
      console.log('result of login', result?.user?._user?.uid);
      const ValueID= result?.user?._user?.uid;
      dispatch(LoginAction(ValueID))
      navigation.navigate('Home', {
        uid: result?.user?._user?.uid,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{marginTop: 40, marginLeft: -340}}
        onPress={() => navigation.navigate('Register')}>
        <Text style={{fontSize: 30, color: 'black'}}>{'<'}</Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 40,
          marginLeft: -200,
          marginTop: 30,
          fontWeight: 'bold',
        }}>
        Login
      </Text>
      <View style={styles.View2}>
        <TextInput
          label={'Email'}
          numberOfLines={1}
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          label={'Password'}
          numberOfLines={1}
          value={password}
          secureTextEntry
          onChangeText={text => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.Touch} onPress={login}>
        <Text style={styles.LoginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', backgroundColor: 'orange'},
  Text: {
    fontSize: 20,
  },
  textInput: {
    height: 80,
    borderWidth: 2,
    margin: 20,
    padding: 10,
    borderRadius: 25,
  },
  View2: {
    width: '90%',
    marginTop: 100,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 30},
    shadowOpacity: 0.8,
    shadowRadius: 30,
    borderRadius: 10,
  },
  Touch: {
    width: '50%',
    backgroundColor: 'white',
    height: 50,
    shadowColor: '#000',
    shadowOffset: {width: 20, height: 30},
    shadowOpacity: 0.8,
    shadowRadius: 30,
    marginTop: 50,
    borderRadius: 30,
    backgroundColor: 'skyblue',
  },
  LoginText: {
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
    color: 'white',
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    width: width / 2.5,
    height: height / 2.5,
  },
});
export default Login;
