//
import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
 
} from 'react-native';
//import { Avatar } from 'react-native-elements';
import moment from 'moment';

import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import {firebase} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {auth} from '../firebaseSvc';
const Chat = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const {receiverUid, sentUid, status} = route.params;
  const login = useSelector(state => state.loginReducer);

  useEffect(() => {
    getMessages();
  }, []);
  useEffect(()=>{

  },[])
  // const FsetIsTyping = () => {
  //   setIsTyping(!isTyping);
  // };
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
  const renderFooter = () => {
    if (isTyping) {
      return <Text style={{fontSize: 5}}> is typing</Text>;
    }
    return null;
  };
  const onDelete = messageIdToDelete => {
    console.log('messageIdToDelete:::::::::::::::>', messageIdToDelete);
    const docid =
      receiverUid > sentUid
        ? sentUid + '-' + receiverUid
        : receiverUid + '-' + sentUid;
    console.log('sentUid', sentUid, docid);
    //const list=messages.filter((item)=>item?._id!== messageIdToDelete?._id)
    // console.log("list",list);
    // setMessages(list)
    const response = firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages')
      .where('text', '==', messageIdToDelete?.text ?? '')
      .get()
      .then(snap => {
        console.log('Snap', snap);
        console.log('snap ref', snap._docs[0].ref);
        snap._docs[0]?._ref.delete();
      });
  
    // console.log('documentSnapshot', documentSnapshot.data());
    // documentSnapshot()?.FirestoreQuerySnapshot?._docs[0]?._data?.list.filter(
    //   item => item?._id === messageIdToDelete?._id,
   
    console.log('Response', response);
    // console.log('res->', response.then(res=>{
    //   console.log("res",res.docs[0]?._data);
    // }));
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
            //Clipboard.setString();
            break;
          case 1:
            onDelete(message);
            break;
        }
      },
    );
  };
  console.log('status', status);
  return (
    <View style={{flex: 1}}>
      <View style={styles.statusView}>
        <Text style={{alignSelf: 'center', fontSize: 14}}>
          {status == 'online'
            ? 'online'
            : 'Last Active ' + moment(status).format('MMMM Do YYYY, h:mm:ss a')}
        </Text>
      </View>
      <GiftedChat
        messages={messages}
        style={{flex: 1, backgroundColor: 'yellow'}}
        onSend={messages => onSend(messages)}
         isTyping={true}
        
        //onInputTextChanged={FsetIsTyping}
        user={{
          _id: sentUid,
        }}
        // renderFooter={renderFooter}
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
