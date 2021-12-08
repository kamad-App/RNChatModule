import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {IconButton, TextInput, Button, FAB, Title} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const CreateRoom = ({navigation}) => {
  const [roomName, setRoomName] = useState(null);

  const handlePress = () => {
    if (!roomName)
    {
      Alert.alert('Please Add the Room Name');
    } else {
      firestore()
        .collection('Threads')
        .add({
          name: roomName,
        })
        .then(() => {
          navigation.navigate('Room');
        });
     
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={'Room Name'}
        value={roomName}
        onChangeText={text => setRoomName(text)}
        style={styles.input}
        numberOfLines={1}
      />
      <Button
        mode={'contained'}
        onPress={handlePress}
        style={styles.button}
        contentStyle={styles.buttonContainer}>
        Add Room
      </Button>
    </View>
  );
};
export default CreateRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 100,
    marginTop: 50,
  },
  input: {
    width: '100%',
  },
  buttonContainer: {
    width: '70%',
  },
});
