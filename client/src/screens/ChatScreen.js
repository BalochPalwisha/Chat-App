import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, Platform, ToastAndroid, RefreshControlBase, Dimensions, PermissionsAndroid, Alert, KeyboardAvoidingView } from 'react-native';
import CustomHeader from "../components/Header"
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { GiftedChat, Bubble, Send, InputToolbar, Time, Colors, Message, MessageImage, MessageText, } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons'
import { IconButton } from 'react-native-paper';
import NodeServer from '../helpers/NodeSocket';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';
import moment from 'moment';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
import Sound from "react-native-sound";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Slider from 'react-native-slider';
import SoundComponent from '../components/SoundComponent';
import Entypo from "react-native-vector-icons/Entypo";
import * as AudioComponent from '../components/AudioComponent';
import CustomView from "./CustomView";
import AndroidSoundComponent from '../components/AndroidSoundComponent';


const server = NodeServer.getInstance()

const file = null;

export default function ChatScreen(props) {


  //console.log("props", props)

  const { user, logout } = useAuth();


  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [recieverId, setRecieverId] = useState('');
  const [Allmessages, setMessages] = useState([]);
  const [runFunction, setRunFunction] = useState(true)
  const [singleFile, setSingleFile] = useState(null);
  const [startAudio, setAudio] = useState(false);
  const [hasPermission, setPermission] = useState(undefined);
  const [recording, setRecording] = useState(false);
  const [stoppedRecording, setStoppedRecording] = useState(false);
  const [audioPath] = useState(`${AudioUtils.DocumentDirectoryPath}/${messageIdGenerator()}recording.aac`);
  const [fileObj, setFileObj] = useState([])

  useEffect(() => {

    //console.log('Props', props)
    setUserId(props.route.params.senderId);
    setUserName(props.route.params.senderName);
    setUserPhoto(props.route.params.senderPhoto);
    setRecieverId(props.route.params.recieverId)

    console.log('stfunction', runFunction)

    {
      runFunction == true ?

        getMessages() : false
    }

    setRunFunction(false);

    server.getIncomingMessages(() => {
      getMessages();
    })

    console.log('FilePath', audioPath);

    AudioComponent.handleAudioAfterPermission(audioPath, (isAutharized) => {
      console.log('isAuthorized', isAutharized);
      setPermission(isAutharized)
    });

  }, [])


  const getMessages = async () => {
    console.log('Coming from server');
    try {
      let response = await axios.get(
        'http://192.168.86.54:3000/api/chatUsers/' +
        '/chats/' +
        props.route.params.senderId +
        '/' +
        props.route.params.recieverId,
      );
      if (response.status === 200) {
        console.log('response', response.data)


        setMessages(previousMessages => GiftedChat.append([], response.data));

      }
    } catch (error) {
      console.error(error);
    }
  };



  const onSend = useCallback(async (currentMessage = []) => {

    setMessages(previousMessages => GiftedChat.append(previousMessages, currentMessage));
    server.sentMessageToServer();

    try {

      let formData = {
        sender: props.route.params.senderId,
        reciever: props.route.params.recieverId,
        messages: currentMessage[0],
      };
      console.log("formDataaa", formData);

      // return false;

      let response = await axios.post(
        'http://192.168.86.54:3000/api/chatUsers/' + 'chats/',
        formData,
      );
      if (response.status === 200) {
        //console.log(response.config.data);
        server.sentMessageToServer();
      }
    } catch (error) {
      console.error(error);
    }

  }, [])




  function renderBubble(props) {

    return (


      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'rgba(86, 204, 242, 0.25)'
          },
          left: {
            backgroundColor: 'rgba(111, 207, 151, 0.15)'
          }

        }}
        textStyle={{
          left: {
            color: '#3F3D56',
          },
          right: {
            color: '#3F3D56',
          },
        }}

      />

    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={35} color='#0e92be' />
        </View>
      </Send>
    );
  }

  function messageIdGenerator() {
    // generates uuid.
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  let selectFile = async () => {

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('FileResponse', res)
      setFileObj(res)
      uploadFile(res)
    } catch (err) {

      if (DocumentPicker.isCancel(err)) {
        // alert('Canceled from single doc picker');
      } else {
        alert('Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  const uploadFile = async (file) => {


    console.log("singleFile", file)
    const fileToUpload = file;
    const formData = new FormData();

    formData.append('file', fileToUpload);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data; ',
      },
    }

    axios
      .post('http://192.168.86.54:3000/api/images/uploadFile', formData, config)
      .then(res => {
        //console.log(res);
        if (res.status === 200) {
          console.log(res);
          // return false;
          const id = messageIdGenerator();
          let imageMsg = []
          if (file.type == "video/mp4") {
            let msgObj =
            {
              _id: id,
              text: '',
              createdAt: new Date(),
              user: {
                _id: userId,
                name: userName,
                avatar: userPhoto,
              },
              video: res.data.img,
            }
            imageMsg.push(msgObj)
          }
          else if (file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png") {

            let msgObj =
            {
              _id: id,
              text: '',
              createdAt: new Date(),
              user: {
                _id: userId,
                name: userName,
                avatar: userPhoto,
              },
              image: res.data.img,
            }
            imageMsg.push(msgObj)

          }
          else {
            let msgObj =
            {
              _id: id,
              text: '',
              createdAt: new Date(),
              user: {
                _id: userId,
                name: userName,
                avatar: userPhoto,
              },
              "file": res.data.img,
            }
            imageMsg.push(msgObj)

          }

          onSend(imageMsg);
          imageMsg = [];

        } else {
          console.log("Uploading failed. Try again")
        }
      })


  };

  const uploadAudioFile = (file) => {

    const fileToUpload = file;


    const formData = new FormData();

    formData.append('file', fileToUpload);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data; ',
      },
    }


    axios
      .post('http://192.168.86.54:3000/api/images/uploadFile', formData, config)
      .then(res => {
        //console.log(res);
        if (res.status === 200) {
          console.log(res);
          let AudioMsg = []

          let msgObj =
          {
            _id: messageIdGenerator(),
            text: '',
            createdAt: new Date(),
            user: {
              _id: userId,
              name: userName,
              avatar: userPhoto,
            },
            audio: res.data.img,
          }
          AudioMsg.push(msgObj)
          onSend(AudioMsg);
          AudioMsg = [];
        } else {
          Alert.alert('Error in recording. Try again!')
        }

      })



  }

  const handleAudioRecording = () => {

    if (!recording) {
      AudioComponent.record(hasPermission, recording, stoppedRecording, audioPath, (recordinggg) => {
        setRecording(recordinggg);
      })
    }
    else {
      AudioComponent.stop(recording, (stoppedRecording, recordinggg) => {
        setStoppedRecording(stoppedRecording);
        setRecording(recordinggg);

      })
      onFinishRecording()
    }
  }



  const onFinishRecording = () => {

    const fileName = `${messageIdGenerator()}.aac`;


    const file = {
      uri: Platform.OS === "ios" ? audioPath : `file://${audioPath}`,
      name: fileName,
      type: `audio/aac`
    }

    uploadAudioFile(file);


  }

  //styling input bar
  const renderInputToolbar = props => {
    return (
      <>

        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: '#FAFAFB',
            borderTopWidth: 0,
            marginHorizontal: 10,
            marginLeft: '20%',
            borderRadius: 80,
            marginBottom: Platform.OS == "android" ? 5 : 0,
            //borderColor:'gray',
            //borderWidth:1

          }}
          textInputProps={{
            style: {
              color: '#3F3D56',
              flex: 1,
              paddingHorizontal: 20,
              marginLeft: 2,
              bottom: Platform.OS == "android" ? 0 : 14

            },
            multiline: false,
            returnKeyType: 'go',
            onSubmitEditing: () => {
              if (props.text && props.onSend) {
                let text = props.text;
                props.onSend({ text: text.trim() }, true);
              }
            }
          }}
        />
        <View style={{
          flexDirection: 'row', alignItems: 'center', position: 'absolute',
          marginLeft: '2%',
          marginBottom: Platform.OS == "android" ? '2%' : '1%',
          bottom: 0,
        }}>

          <TouchableOpacity style={{ marginLeft: '6%' }}

            onPress={() => handleAudioRecording()}
          >
            <Icon
              name="ios-mic"
              size={40}
              style={{
                color: recording ? "red" : "#0e92be",
              }}
              size={25}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: '6%' }}

            onPress={() => selectFile()}
          >
            <Entypo
              name="attachment"
              style={{
                color: '#0e92be',
              }}
              size={22}
            />
          </TouchableOpacity>
        </View>

      </>
    );
  };

  const setDate = (msgDate) => {

    let mDatetime = moment(msgDate).format('DD MMM,YYYY HH:mm a')
    return mDatetime;

  }

  const renderMessageVideo = (prop) => {
    console.log('VideoCurrentMessage', prop.currentMessage)
    let userName = ''
    if (prop.currentMessage.user._id == userId) {
      userName = "You"
    }
    else userName = prop.currentMessage.user.name
    let messageDate = setDate(prop.currentMessage.createdAt)
    return (
      <View style={{ padding: 20, height: 200, width: 150 }}>
        <Video source={{ uri: prop.currentMessage.video }}   // Can be a URL or a local file.
          resizeMode={"cover"}
          paused={true} // this will manage the pause and play          
          style={styles.backgroundVideo}

        />

        <TouchableOpacity style={{ position: 'absolute', top: '50%', right: 0, left: '50%' }}>
          <Icon name="play-circle-outline" size={50} color="#fff" onPress={() => props.navigation.navigate('Video',
            {
              link: prop.currentMessage.video,
              username: userName,
              mDate: messageDate
            }
          )} />
        </TouchableOpacity>
      </View>

    );
  };

  const renderMessage = (props) => {

    const {
      currentMessage,
    } = props;
    const { image: currMsg } = currentMessage

    let iconName = ""
    let iconColor = ""
    let docName = ""

    if (currMsg != undefined) {

      if (currMsg.includes('.png') || currMsg.includes('.jpg')) {
        console.log('msgProps', { ...props })
        return (
          <View style={{ marginHorizontal: 10, marginVertical: 2 }}>
            <Bubble {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'rgba(86, 204, 242, 0.25)'
                },
                left: {
                  backgroundColor: 'rgba(111, 207, 151, 0.15)'
                }

              }}
              textStyle={{
                left: {
                  color: '#3F3D56',
                },
                right: {
                  color: '#3F3D56',
                },
              }}

            >
              <MessageImage
                {...props} // <-- this
                style={{ height: 100, width: 100 }}
                source={{ uri: props.currentMessage.image }}
              />
            </Bubble>
          </View>
        )
      } else {



        if (currMsg.includes('.pdf')) {
          iconName = "file-pdf-o"
          iconColor = "red"
          docName = "Pdf document"
        }

        if (currMsg.includes('.doc')) {
          iconName = "file-word-o"
          iconColor = "blue"
          docName = "Word document"
        }

        return (

          <View style={{ marginLeft: "40%", paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, backgroundColor: 'rgba(111, 207, 151, 0.15)', marginHorizontal: 20, width: '55%' }}>
            <Icon1 name={iconName} color={iconColor} size={22} />
            <Text>{docName}</Text>
            <Icon3 name="download-circle-outline" color='gray' size={24} />
          </View>



        )
      }
    }
    else {
      return (
        <Message {...props} />
      )
    }

  }


  const renderAudio = (props) => {
    //console.log('AudioMsg', props.currentMessage)

    if (!props.currentMessage.audio) {
      alert('null')
      return <View />
    }
    else {

      let currentUser;
      if (props.currentMessage.user._id == userId) {
        currentUser = true;
      }

      if (Platform.OS == "android") {
        return (
          <View style={{ height: 40, width: 250, padding: 10, justifyContent: 'center', top: 12 }}>

            <AndroidSoundComponent
              filepath={props.currentMessage.audio}
              user={currentUser}

            />
          </View>
        )
      }
      else {

        return (
          <View style={{ height: 40, width: 250, padding: 10, justifyContent: 'center', top: 12 }}>

            <SoundComponent
              filepath={props.currentMessage.audio}
              user={currentUser}

            />
          </View>
        )
      }

    }
  };

  const renderCustomView = (props) => {

    return (
      <CustomView {...props} />


    )

  }

  return (
    <View style={styles.container}>
      <CustomHeader
        headerText={props.route.params.recieverName}
        onBackPressed={() => { props.route.params.screen == "Chats" ? props.navigation.goBack() : props.navigation.popToTop() }
        }
      />


      <GiftedChat
        messages={Allmessages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userId,
          name: userName,
          avatar: userPhoto,

        }}
        messagesContainerStyle={{ paddingBottom: 20 }}
        // showUserAvatar={true}
        alwaysShowSend={true}
        scrollToBottom
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        // messageIdGenerator={messageIdGenerator}
        timeTextStyle={{ left: { color: '#3F3D56' }, right: { color: '#3F3D56' } }}
        renderMessageVideo={renderMessageVideo}
        renderMessageAudio={renderAudio}
        renderCustomView={renderCustomView}

      // renderMessage={renderMessage}



      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 10,
    top: Platform.OS == "android" ? 5 : 2,

  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 5

  },
  thumb: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: '#0e92be',
  },
  track: {
    height: 4,
    borderRadius: 5,
    backgroundColor: '#d0d0d0',
  },

});