import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {auth} from '../firebaseSvc';
const Login = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Signed in
        var user = userCredential.user;
        // ...
        navigation.navigate('Chat');
        user
          .updateProfile({
            displayName: name,
          })
          .catch(error => {
            alert(error.message);
          });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
        alert(errorMessage);
      });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{marginTop: 40,marginLeft:-340}} onPress={()=>navigation.goBack()}>
        <Text style={{fontSize:30 ,color:'black'}}>
        {"<"}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 40,
          marginLeft: -200,
          marginTop: 30,
          fontWeight: 'bold',
        }}>
        Register
      </Text>
      <View style={styles.View2}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={styles.textInput}
        />
      </View>
      <TouchableOpacity style={styles.Touch} onPress={register}>
        <Text style={styles.LoginText}>Login</Text>
      </TouchableOpacity>
      {/* <Button title="Login"  style={styles.button} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', backgroundColor: 'yellow'},
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
    shadowRadius: 5,
    borderRadius: 30,
  },
  Touch: {
    width: '50%',
    backgroundColor: 'white',
    height: 50,
    shadowColor: '#000',
    shadowOffset: {width: 20, height: 30},
    shadowOpacity: 0.8,
    shadowRadius: 5,
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
});
export default Login;