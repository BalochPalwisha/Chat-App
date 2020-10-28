import AsyncStorage from '../helpers/AsyncStorage'
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import CustomHeader from "../components/Header"
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';
import Services from '../connectivity/Superagent'
import axios from "axios";
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Fab } from 'native-base';
import Loading from '../components/Loading';



export default function AllUsers({ navigation }) {

    const { user, logout } = useAuth();

    let jsonP = JSON.parse(user)

    //initialize the sockets
    // const socket = io('http://192.168.86.54:3000/');
    // socket.connect();


    const [AllUsers, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        getUsers();

    }, [])




    const getUsers = () => {
        Services.getUsers((res, err) => {
            if (res) {

                //let response = JSON.parse(response)
                console.log('Res ==>', res)
                setUsers(res);
                setLoading(false);
            }

            else {
                console.log('Err ==>', err)
            }
        })
    }

    const renderUsers = (data) => {
        console.log('data', data)

        return (
            <View style={{ marginHorizontal: 10, backgroundColor: "White" }} key={data.item.userId} >
                <TouchableOpacity onPress={() => navigation.navigate('Chat', {
                    recieverName: data.item.name,
                    recieverId: data.item.userId,
                    recieverPhoto: data.item.photo,
                    senderId: jsonP.userId,
                    senderName: jsonP.userName,
                    senderPhoto: "",
                    screen: 'People'
                     
                     })}>

                    <View
                        style={{
                            flex: 2,
                            flexDirection: 'row',
                            //marginVertical: '2%',
                            paddingVertical: '2%',
                            borderRadius: 10,
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#E5E5E5'
                        }}>
                        <Image
                            source={
                                require('../assets/user.jpg')
                            }
                            style={{
                                width: 45,
                                height: 45,
                                borderRadius: 45 / 2,
                                //borderColor: '#444',
                                //borderWidth: 2,
                            }}
                        />
                        {data.item.isActive == false ? null :
                            <View
                                style={{
                                    position: 'absolute',
                                    backgroundColor: '#46CF76',
                                    width: 15,
                                    height: 15,
                                    left: 32,
                                    top: 35,
                                    borderRadius: 100,
                                    borderColor: '#E5E5E5',
                                    borderWidth: 2,
                                }}
                            />}
                        <View style={{
                            flex: 2,
                            flexDirection: 'column',
                            marginHorizontal: '5%',

                        }}>
                            <Text style={{ fontSize: 18, fontWeight: '400', color: '#3F3D56' }}>
                                {data.item.name}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )

    }



    return (
        <View style={styles.container}>
            <CustomHeader
                headerText="People"
                onBackPressed={() => navigation.goBack()}
            />
            {loading ? <Loading /> :
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        data={AllUsers}
                        keyExtractor={item => item.userId}
                        renderItem={renderUsers}
                    />
                </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    }
});