import AsyncStorage from '../helpers/AsyncStorage'
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, ScrollView, Alert } from 'react-native';
import CustomHeader from "../components/Header"
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';
import Services from '../connectivity/Superagent'
import axios from "axios";
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Fab } from 'native-base';
import Loading from '../components/Loading';
import NodeServer from '../helpers/NodeSocket';

const server = NodeServer.getInstance()

export default function HomeScreen({ navigation }) {

  const { user, logout } = useAuth();

  let jsonP = JSON.parse(user)

  //initialize the sockets
  // const socket = io('http://192.168.86.54:3000/');
  // socket.connect();

  server.connectSocket(() => {
    console.log('connected!')
  });


  const [userChats, setUserChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [Images, setImages] = useState([])

  const onSuccess = () => {

    navigation.navigate('Login')

  }


  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      // Alert.alert('focused')
      getMessages();
    });
    getImages();




    server.sendUserInfo(jsonP.userId);
    server.getIncomingMessages(() => {
      getMessages();
    });
    server.updateUserStatus(() => {
      getMessages();
    })

    return unsubscribe;

  }, [navigation])




  const getMessages = async () => {
    try {
      let response = await axios.get(
        'http://192.168.86.44:3000/api/chatUsers' +
        '/chats/' +
        jsonP.userId,
      );
      // console.log('Res==>', response)
      if (response.status === 200) {
        let chats = [];

        for (var i = 0; i < response.data.length; i++) {
          //console.log('Res==>2', response.data[i].sender + " ---- " + jsonP.userId)
          if (response.data[i].sender == jsonP.userId) {
            await axios
              .get(
                'http://192.168.86.44:3000/api/chatUsers/find/' +
                response.data[i].reciever,
              )
              .then(res => {
                //console.log('Res==>3', res)
                const chatItem = {
                  message: response.data[i].messages[0].text
                    ? response.data[i].messages[0].text
                    : 'Sent an image',
                  user: res.data,
                };
                chats.push(chatItem);
              });
          } else {

            await axios
              .get(
                'http://192.168.86.44:3000/api/chatUsers/find/' +
                response.data[i].sender,
              )
              .then(res => {
                //console.log("res6", res)
                const chatItem = {
                  message: response.data[i].messages[0].text
                    ? response.data[i].messages[0].text
                    : 'Sent an image',
                  user: res.data,
                };
                chats.push(chatItem);
              });
          }
        }
        setUserChats(chats)
        setLoading(false);
      }
    } catch (error) {
      console.error("###", error);
      if (error) {
        setErrorMessage('Please check your Connection')
      }
    }
  };





  const getChatUSers = () => {

    console.log('UserChats', userChats)



    return (
      <ScrollView
        style={{
          paddingHorizontal: '7%',
          marginBottom: '18%',
          paddingBottom: '1.5%',
        }}>
        <TouchableOpacity >
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              marginVertical: '2%',
              paddingVertical: '4%',
              borderRadius: 10,
            }}>
            <Image
              source={
                require('../assets/user.jpg')
              }
              style={{ width: 60, height: 60, borderRadius: 70 }}
            />
            <View
              style={{
                flex: 2,
                flexDirection: 'column',
                marginHorizontal: '5%',
                marginTop: '1%',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  //fontFamily: 'Cairo-SemiBold',
                  color: '#3F3D56',
                }}>
                {jsonP.userName}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  // fontFamily: 'Cairo-Light',
                  color: '#68696C',
                }}>
                I am a current User.
                  </Text>
            </View>
          </View>
          <View style={{ borderBottomColor: '#E5E5E5', borderBottomWidth: 1, }} />
        </TouchableOpacity>

        {userChats.length == 0
          ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '20%' }}>
            <Text style={{ color: 'gray', fontSize: 18, fontWeight: '500' }}>You have no chats</Text>
          </View>
          :

          userChats.map(chatItem => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Chat', {
                  recieverName: chatItem.user.name,
                  recieverId: chatItem.user.userId,
                  recieverPhoto: chatItem.user.photo,
                  senderId: jsonP.userId,
                  senderName: jsonP.userName,
                  senderPhoto: "",
                  screen: "Chats"
                });
                // console.log(this.props);
              }}
            >
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  marginVertical: '2%',
                  paddingVertical: '4%',
                  borderRadius: 10,
                }}>
                <Image
                  source={
                    require('../assets/user2.png')
                  }
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 30,
                    //borderColor: '#444',
                    //borderWidth: 2,
                  }}
                />
                {chatItem.user.isActive == false ? null :
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: '#46CF76',
                      width: 15,
                      height: 15,
                      left: 40,
                      top: 50,
                      borderRadius: 100,
                      borderColor: '#E5E5E5',
                      borderWidth: 1,
                    }}
                  />}
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'column',
                    marginHorizontal: '5%',
                    marginTop: '1%',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      //fontFamily: 'Cairo-SemiBold',
                      color: '#3F3D56',
                    }}>
                    {chatItem.user.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      //fontFamily: 'Cairo-Light',
                      color: '#68696C',
                    }}>
                    {chatItem.message}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        }

      </ScrollView>
    )

  }

  const onClickLogout = () => {
    server.disconnectUser(jsonP.userId);
    console.log('its done')
    logout(onSuccess);
  }

  const rightComponent = () => {

    let right = (
      <View>
        <AntIcon name='logout' color='#fff' size={22} onPress={() => onClickLogout()} />
      </View>)

    return right;



  }

  const fabComponent = () => {
    return (
      <View style={{ flex: 1 }}>
        <Fab
          //active={this.state.active}
          direction="up"
          containerStyle={{ marginBottom: '10%', marginRight: '2%' }}
          style={{ backgroundColor: '#0e92be' }}
          position="bottomRight"
          onPress={() => navigation.navigate('People')}>
          <MaterialIcon name="message" size={25} />

        </Fab>

      </View>
    )
  }
  const getImages = async () => {
    await axios
      .get('http://192.168.86.44:3000/api/images/getImages')
      .then(res => {
        console.log("res6", res)
        setImages(res.data)
      })
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        headerText="Chats"
        hideBackButton={true}
        rightComponent={rightComponent()}

      />

      {(errorMessage != "") ?

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '20%' }}>
          <Text style={{ color: 'gray', fontSize: 18, fontWeight: '500' }}>{errorMessage}</Text>
        </View>
        :
        loading ? <Loading /> :

          getChatUSers()}

      
      {fabComponent()}



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  }
});