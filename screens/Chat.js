//
import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
//import { Avatar } from 'react-native-elements';
import {auth, db} from '../firebaseSvc';
import {GiftedChat} from 'react-native-gifted-chat';
import {firebase} from '@react-native-firebase/firestore';

const Chat = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        navigation.replace('Login');
      })
      .catch(error => {
        // An error happened.
        console.log(error);
      });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={signOut}>
          <Text>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'React native',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ]);
  // }, []);
  console.log('====>', messages);

  useEffect(() => {
    console.log('Unsub---->', unsubscribe);
    const unsubscribe = db
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot =>
        setMessages(
          snapshot?.docs.map(doc => ({
            _id: doc?.data()._id,
            createdAt: doc?.data().createdAt.toDate(),
            text: doc?.data().text,
            user: doc?.data().user,
          })),
        ),
      );
  }, []);

  const onSend = (messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    db.collection('chats').add({_id, createdAt, text, user});
  };
  return (
    <GiftedChat
      messages={messages}
      loadEarlier={true}
      alwaysShowSend={true}
      style={{flex: 1, backgroundColor: 'yellow'}}
      //renderUsernameOnMessage={true}
      onSend={messages => onSend(messages)}
      scrollToBottom={true}
      user={{
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
        avatar: auth?.currentUser?.photoURL,
      }}
    />
  );
};
const styles = StyleSheet.create({});
export default Chat;
