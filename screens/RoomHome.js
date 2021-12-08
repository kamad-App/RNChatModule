import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, LogBox} from 'react-native';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
LogBox.ignoreAllLogs(true);
const RoomHome = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);

  const {sentUid, screen} = route.params;
  console.log('Routes-------->', route.params);

  const login = useSelector(state => state.loginReducer);
  console.log('Redux------------------------>', login?.loginKey);
  useEffect(() => {
    getMessages();
  }, []);
  const getMessages = () => {
    const docid = login?.loginKey;
    const messageRef = firestore()
      .collection('Threads')
      .doc(sentUid)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    messageRef.onSnapshot(querySnap => {
      const allMsgs = querySnap.docs.map(dataSnap => {
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
  };

  const onSend = (messages = []) => {
    const msgs = messages[0];
    const myMsgs = {
      ...msgs,
      sentBy: login?.loginKey,
      createdAt: new Date(),
    };
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, myMsgs),
    );
    const docid = login?.loginKey;
    firestore()
      .collection('Threads')
      .doc(sentUid)
      .collection('messages')
      .add(myMsgs);
  };

  return (
    <GiftedChat
      messages={messages}
      style={{flex: 1, backgroundColor: 'yellow'}}
      onSend={messages => onSend(messages)}
      user={{
        _id: login?.loginKey,
      }}
      renderUsernameOnMessage={true}
      showUserAvatar={true}
      
    />
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
});

export default RoomHome;
