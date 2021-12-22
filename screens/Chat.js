import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal,
  Alert,
  Clipboard
} from 'react-native';

import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Actions,
  ActionsProps,
} from 'react-native-gifted-chat';
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
  const openPhotoGallery = (isCrop, callback) => {
    const options = {
      width: 1024,
      height: 1024,
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      avoidEmptySpaceAroundImage: true,
      cropping: isCrop,
      cropperCircleOverlay: isCrop,
      mediaType: 'photo',
    };
  };
  const getImageObject = (imageObj, isForlibrary) => {
    const fileNameA = imageObj.path.split('/');
    const filename = fileNameA[fileNameA.length - 1];
    const imagepath = `file:///${imageObj.path}`;
    const imgeObjConverted = {
      uri: imagepath,
      name: filename,
      filename,
      type: imageObj.mime,
    };
    return imgeObjConverted;
  };

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
  // const newMsg = {
  //  // ...message,
  //  // deletedBy: this.props.user.uid,
  // };
  // firestore()
  //   .collection('deleted chats')
  //   .doc(docid)
  //   .collection('messages')
  //   .add(newMsg);
  // this.setState(previousState => ({
  //   messages: previousState.messages.filter(
  //     message => message._id !== messageIdToDelete,
  //   ),
  // }));

  const handleImages = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setCoverPhoto(image.path);
    });
  };
  console.log('coverPhoto>', coverPhoto);
  const onSend = (messages = []) => {
    const msgs = messages[0];
    const myMsgs = {
      ...msgs,
      sentBy: sentUid,
      sentTo: receiverUid,
      createdAt: new Date(),
      image: coverPhoto,
    };
    console.log('coverphyo>', coverPhoto);
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
    // console.log('res->', response.then(res=>{
    //   console.log("res",res.docs[0]?._data);
    // }));
  };
  //console.log('messages=>', messages);
  const MessageInfo = () => {
    return (
      // <View style={styles.centeredView}>
      //   <Modal
      //     animationType="slide"
      //     transparent={true}
      //     visible={modalVisible}
      //     onRequestClose={() => {
      //       Alert.alert('Modal has been closed.');
      //       setModalVisible(!modalVisible);
      //     }}>
      //     <View style={styles.centeredView}>
      //       <View style={styles.modalView}>
      //         <Text style={styles.modalText}>Hello World!</Text>
      //       </View>
      //     </View>
      //   </Modal>
      // </View>

      Alert.alert('')
    );
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
            Clipboard.setString();
            break;
          case 2:
            onDelete(message);
            break;
        }
      },
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.statusView}>
        <Text style={{alignSelf: 'center', fontSize: 14}}>
          {status == 'online'
            ? 'online'
            : 'Last Active ' + moment(status).format(' h:mm:ss a')}
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
        renderAvatarOnTop
        onLongPress={onLongPress}
        onPressActionButton={handleImages}
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
              //   containerStyle={{borderTopWidth: 0.5, borderWidth: 0.2}}
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default Chat;
