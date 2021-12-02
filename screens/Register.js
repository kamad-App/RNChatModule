import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import firebaseSvc from '../firebaseSvc';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {auth} from '../firebaseSvc';
import whatsApp from '../images/whatsApp.jpeg';
import firestore from '@react-native-firebase/firestore';

const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [showText, setShowText] = useState(false);

  const register = async () => {
    if (!email || !password || !name) {
      Alert.alert('Add the Fields');
    }
    const result = await auth?.createUserWithEmailAndPassword(email, password);
    firestore().collection('users').doc(result.user.uid).set({
      name: name,
      email: result.user.email,
      uid: result.user.uid,
    });
   navigation.navigate('Home',{uid:result.user.uid})
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 40,
          marginLeft: -200,
          marginTop: 70,
          fontWeight: 'bold',
        }}>
        Register
      </Text>

      <View style={styles.View2}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.textInput}
        />
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
        <Text style={styles.LoginText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Touch}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.LoginText}>Login</Text>
      </TouchableOpacity>
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
    marginTop: 60,
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
    marginTop: 40,
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
export default Register;
