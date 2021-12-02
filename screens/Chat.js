//
import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
//import { Avatar } from 'react-native-elements';
import {auth, db} from '../firebaseSvc';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import {firebase} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const Chat = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const {receiverUid, user, sentUid} = route.params;
  console.log('chat route------------->', route.params);

  useEffect(() => {
    // getAllMsgs();
    const docid =
      receiverUid > sentUid
        ? sentUid + '-' + receiverUid
        : receiverUid + '-' + sentUid;
    console.log('Docid', docid);
    const messageRef = firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    messageRef.onSnapshot(querySnap => {
      const allMsgs = querySnap.docs.map(dataSnap => {
        console.log('dataSnap>>>>>>>>>>>>', dataSnap.data().createdAt);
        const data = dataSnap.data();
        if (data.createdAt) {
          return {
            ...dataSnap.data(),
            createdAt: dataSnap.data().createdAt.toDate(),
          };
        } else {
          return {
            ...dataSnap.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allMsgs);
    });
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

  console.log('====>', messages);

  const getAllMsgs = async () => {
    console.log('getAllmsg');
    const docid =
      receiverUid > sentUid
        ? sentUid + '-' + receiverUid
        : receiverUid + '-' + sentUid;
    console.log('Docid', docid);
    const querySnap = await firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();

    const allMsgs = querySnap.docs.map(dataSnap => {
      console.log('dataSnap>>>>>>>>>>>>', dataSnap.data().createdAt);
      return {
        ...dataSnap.data(),
        createdAt: dataSnap.data().createdAt.toDate(),
      };
    });
    setMessages(allMsgs);
    console.log('querySnap==================================>', allMsgs);
  };

  const onSend = (messages = []) => {
    const msgs = messages[0];
    const myMsgs = {
      ...msgs,
      sentBy: sentUid,
      sentTo: receiverUid,
      createdAt: new Date(),
    };
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, myMsgs),
    );
    const docid =
      receiverUid > sentUid
        ? sentUid + '-' + receiverUid
        : receiverUid + '-' + sentUid;
    firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages')
      .add({myMsgs, createdAt: firestore.FieldValue.serverTimestamp()});

    // // const {_id, createdAt, text, user} = messages[0];
    //db.collection('users');
  };

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        style={{flex: 1, backgroundColor: 'yellow'}}
        onSend={messages => onSend(messages)}
        user={{
          _id: sentUid,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'green',
                },
                left: {
                  backgroundColor: 'white',
                },
              }}
            />
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{borderTopWidth: 2.5, borderTopColor: 'green'}}
            />
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({});
export default Chat;
