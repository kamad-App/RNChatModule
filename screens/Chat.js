import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Alert, ImageBackground} from 'react-native';
import BGimage from '../images/BGimage.jpeg';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';

const Chat = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {receiverUid, sentUid, status} = route.params;
  const login = useSelector(state => state.loginReducer);

  useEffect(() => {
    getMessages();
  }, []);
  useEffect(() => {
    getReceiverInfo();
  }, []);

  const getReceiverInfo = () => {
    const userRef = firestore()
      .collection('users')
      .where('uid', '==', receiverUid);
    userRef.onSnapshot(query => {
      var response = query?.docs.map(docs => docs?._data?.isTyping);
      setIsTyping(response[0]);
    });
  };

  const onChatTextChanged = text => {
    if (text)
      firestore()
        .collection('users')
        .doc(login?.loginKey)
        .update({isTyping: true});
    else
      firestore()
        .collection('users')
        .doc(login?.loginKey)
        .update({isTyping: false});
  };

  const filterMessage = allMessages => {
    const docid =
      receiverUid > sentUid
        ? sentUid + '-' + receiverUid
        : receiverUid + '-' + sentUid;
    const delMsgRef = firestore()
      .collection('deleted chats')
      .doc(docid)
      .collection('messages');
    delMsgRef.onSnapshot(query => {
      const allDeletedMessages = query.docs.map(docsnap => docsnap.data());
      console.log('allDeletedMessages', allDeletedMessages);
      const msgDeletedByUs = allDeletedMessages.filter(
        item => item.deletedBy == login?.loginKey,
      );
      const delMsgIdArray = msgDeletedByUs.map(item => item._id);
      console.log('log---->', delMsgIdArray);
      const filteredMessage = allMessages.filter(
        item => !delMsgIdArray.includes(item._id),
      );
      setMessages(filteredMessage);
    });
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
      //setMessages(allMsgs);
      filterMessage(allMsgs);
    });
  };

  const handleImages = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setCoverPhoto(image.path);
    })
  };

  const onSend = (messages = []) => {
    const msgs = messages[0];
    const myMsgs = {
      ...msgs,
      sentBy: sentUid,
      sentTo: receiverUid,
      createdAt: new Date(),
      image: coverPhoto,
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
      .add(myMsgs);
  };

  const onDelete = message => {
    console.log('messageIdToDelete:::::::::::::::>', message);
    const docid =
      receiverUid > sentUid
        ? sentUid + '-' + receiverUid
        : receiverUid + '-' + sentUid;
    console.log('sentUid', sentUid, docid);

    // const list = messages.filter(item => item?._id !== messageIdToDelete?._id);
    // console.log('list', list);
    // setMessages(list);
    // const response = firestore()
    //   .collection('chats')
    //   .doc(docid)
    //   .collection('messages')
    //   .where('text', '==', messageIdToDelete?.text ?? '')
    //   .get()
    //   .then(snap => {
    //     console.log('Snap', snap);
    //     console.log('snap ref', snap.docs[0].ref);
    //     snap.docs[0]?._ref.delete();
    //   });
    const newMsg = {
      ...message,
      deletedBy: login?.loginKey,
    };
    firestore()
      .collection('deleted chats')
      .doc(docid)
      .collection('messages')
      .add(newMsg);
    setMessages(previousState =>
      previousState.filter(message => message._id !== message._id),
    );
  };

  const MessageInfo = () => {
    return Alert.alert('Time');
  };
  const onLongPress = (context, message) => {
    console.log('------>', context, message);
    const options = ['Message info', 'copy', 'Delete Message', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            MessageInfo();
            break;
          case 1:
            // Clipboard.setString();
            break;
          case 2:
            onDelete(message);
            break;
        }
      },
    );
  };

  return (
    <ImageBackground source={BGimage} style={{flex: 1}}>
      <View style={styles.statusView}>
        <Text style={{alignSelf: 'center', fontSize: 14}}>
          {status == 'online'
            ? 'online'
            : 'Last seen ' + moment(status).format(' h:mm:ss a')}
        </Text>
      </View>

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        onInputTextChanged={onChatTextChanged}
        user={{
          _id: sentUid,
        }}
        isTyping={isTyping}
        //renderFooter={renderFooter}
        onLongPress={onLongPress}
        onPressActionButton={handleImages}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'green',
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
              containerStyle={{
                borderTopWidth: 0.5,
                height: 50,
                backgroundColor: 'white',
              }}
            />
          );
        }}
      />
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  statusView: {
    height: 20,
    backgroundColor: 'skyblue',
  },
});
export default Chat;