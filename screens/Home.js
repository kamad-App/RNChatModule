import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ImageBackground,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {auth} from '../firebaseSvc';
import img from '../images/img.jpeg';
import {IconButton, FAB, Title} from 'react-native-paper';
import {useSelector} from 'react-redux';
const Home = ({navigation, route}) => {
  const {uid} = route.params;
  const login = useSelector(state => state.loginReducer);
  const [users, setUsers] = useState(null);
  const getUser = async () => {
    const querySnap = await firestore()
      .collection('users')
      .where('uid', '!=', uid)
      .get();

    const allUsers = querySnap.docs.map(docSnap => docSnap.data());

    setUsers(allUsers);
  };
  useEffect(() => {
    getUser();
  }, []);
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => {
        console.log(error);
      });
    firestore().collection('users').doc(login?.uid).update({
      status: firestore.FieldValue.serverTimestamp(),
    });
  };
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity
  //         style={{
  //           marginRight: 10,
  //         }}
  //         onPress={signOut}>
  //         <Text>Logout</Text>
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  const RenderCard = ({item}) => {
    
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Chat', {
            name: item?.name,
            sentUid: route?.params?.uid,
            receiverUid: item?.uid,
            status:
              typeof item?.status === 'string'
                ? item?.status
                : item?.status?.toDate().toString(),
          })
        }>
        <View style={styles.FlatList}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.email}>{item?.email}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ImageBackground source={img} style={{flex: 1}}>
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={({item}) => {
            return <RenderCard item={item} />;
          }}
          extraData={item => item.uid}
        />

        <View style={styles.createRoomB}>
          <FAB large icon="minus" onPress={() => navigation.navigate('Room')} />
        </View>
      </View>
    </ImageBackground>
  );
};
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    borderBottomWidth: 0.2,
  },
  nameText: {
    fontSize: 30,
    margin: 20,
  },
  name: {fontSize: 20, fontWeight: '600', marginLeft: 15},
  email: {fontSize: 18, fontWeight: '200', marginLeft: 15},
  FlatList: {
    margin: 13,
    padding: 14,
    marginTop: 14,
    backgroundColor: 'white',
    borderBottomColor: 'grey',
    borderRadius:20,
    backgroundColor:'lightskyblue'
  },
  createRoomB: {
    position: 'absolute',
    right: 30,
    bottom: 70,
  },
});
