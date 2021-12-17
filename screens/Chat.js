//
import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Clipboard,
} from 'react-native';
//import { Avatar } from 'react-native-elements';

import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import {firebase} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {auth} from '../firebaseSvc';
const Chat = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const {receiverUid, sentUid, status} = route.params;
  const login = useSelector(state => state.loginReducer);

  useEffect(() => {
    getMessages();
  }, []);

  const FsetIsTyping = () => {
    setIsTyping(!isTyping);
  };
  const getMessages = () => {
    const docid =
      receiverUid > sentUid
        ? sentUid + '-' + receiverUid
        : receiverUid + '-' + sentUid;

    const messageRef = firestore()
      .collection('chats')
      .doc(docid)
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
      console.log('alll-->', allMsgs);
    });
  };

  const onSend = (messages = []) => {
    const msgs = messages[0];
    const myMsgs = {
      ...msgs,
      sentBy: sentUid,
      sentTo: receiverUid,
      createdAt: new Date(),
    };
    console.log('mymsgs___>', myMsgs);
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
      .add(myMsgs);
  };
  //   const renderFooter=()=>{
  //     if (isTyping){
  //       return (<Text style={{fontSize:30}}> is typing</Text>)
  //     }
  //     return null;
  // }
  const onDelete = messageIdToDelete => {
    console.log('messageIdToDelete:::::::::::::::>', messageIdToDelete);

    // const list=messages.filter((item)=>item?._id!== messageIdToDelete?._id)
    // console.log("list",list);
    // setMessages(list)
    const response = firestore()
      .collection('chats')
      .doc(sentUid)
      .collection('messages')
      .get()
      .then(documentSnapshot => {
        console.log('documentSnapshot', documentSnapshot);
        documentSnapshot()?.FirestoreQuerySnapshot?._docs[0]?._data?.list.filter(
          item => item?._id === messageIdToDelete?._id,
        );
      })

    console.log('res->', response);
  };
  //console.log('messages=>', messages);
  const onLongPress = (context, message) => {
    console.log('------>', context, message);
    const options = ['copy', 'Delete Message', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString();
            break;
          case 1:
            onDelete(message);
            break;
        }
      },
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.statusView}>
        <Text style={{alignSelf: 'center', fontSize: 14}}>{status}</Text>
      </View>
      <GiftedChat
        messages={messages}
        style={{flex: 1, backgroundColor: 'yellow'}}
        onSend={messages => onSend(messages)}
        isTyping={isTyping}
        onInputTextChanged={FsetIsTyping}
        user={{
          _id: sentUid,
        }}
        //renderFooter={renderFooter}
        onLongPress={onLongPress}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'lightseagreen',
                },
                left: {
                  backgroundColor: 'lightgray',
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
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
};
const styles = StyleSheet.create({
  statusView: {
    height: 20,
    backgroundColor: 'skyblue',
  },
});
export default Chat;