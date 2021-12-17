import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {IconButton, FAB, Title} from 'react-native-paper';

const Room = ({navigation}) => {
  const [threads, setThreads] = useState(null);
  
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Threads')
    //   .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        console.log(querySnapshot);
        const Gthreads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });
        setThreads(Gthreads);
      });

    return () => unsubscribe();
  }, []);
  console.log('----------->', threads);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}>
      <Text style={styles.GText}>Groups </Text>
      <FlatList
        data={threads}
        renderItem={({item}) => {
          console.log('::::::::::::::::>',item);
          return (
            <TouchableOpacity
              style={styles.List}
              onPress={() =>
                navigation.navigate('RoomHome', {
                  sentUid: item?._id,
                  name: item?.name,
                })
              }>
              <View>
                <Text style={styles.ListText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.createRoomB}>
        <FAB
          style={styles.fab}
          large
          icon="plus"
          onPress={() => navigation.navigate('CreateRoom')}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    width: '50%',
    alignSelf: 'center',
  },

  createRoomB: {
    position: 'absolute',
    right: 30,
    bottom: 70,
  },
  List: {
    marginTop: 5,
    height: 40,
    borderBottomWidth: 0.3,
  },
  ListText: {
    padding: 10,
    fontSize: 20,
    fontWeight: '300',
    marginLeft: 10,
  },
  GText: {
    fontSize: 30,
    fontWeight: '500',
    alignSelf: 'center',
  },
});

export default Room;
