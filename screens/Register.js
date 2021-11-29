import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import firebaseSvc from '../firebaseSvc';
import {auth} from '../firebaseSvc';
const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = () => {
    auth
      ?.signInWithEmailAndPassword(email, password)
      //.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        var user = userCredential.user;

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
        alert('No User is Identify in API');
      });
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your email"
        style={styles.text}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        placeholder="Enter your password"
        value={password}
        style={styles.text}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <Button title="sign in" style={styles.button} onPress={register} />
      <Button
        title="register"
        style={styles.button}
        onPress={() => {
          navigation.navigate('Login');
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: 100,
  },
  button: {
    width: 370,
    marginTop: 10,
  },
  text: {
    borderWidth: 2,
    width: '100%',
    height: 50,
    margin: 9,
    borderRadius: 10,
  },
});
export default Register;
