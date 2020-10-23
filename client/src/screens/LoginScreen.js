import React, { useState, useRef, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import useAuth from '../hooks/useAuth'





export default function Login({ navigation }) {

  const {loginUser} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

const handleLogin = () => {
  alert('hi')
}
 

    return (
      <View style={styles.container}>
        <Title style={styles.titleText}>Welcome to Chat app</Title>
        <FormInput
          labelName='Email'
          value={email}
          autoCapitalize='none'
          onChangeText={userEmail => setEmail(userEmail)}
        />
        <FormInput
          labelName='Password'
          value={password}
          secureTextEntry={true}
          onChangeText={userPassword => setPassword(userPassword)}
        />
        <FormButton
          title='Login'
          modeValue='contained'
          labelStyle={styles.loginButtonLabel}
          onPress={()=> loginUser(email, password)}
          
        />
        <TouchableOpacity style={{marginTop:20}} onPress={() => navigation.navigate('Signup')}>
          <Text style={{color:"#0e92be", fontSize:16, fontWeight:'500'}}>New user? Join here</Text>
        </TouchableOpacity>
        {/* <FormButton
          title='New user? Join here'
          modeValue='text'
          uppercase={false}
          labelStyle={styles.navButtonText}
          onPress={() => navigation.navigate('Signup')}
        /> */}
      </View>
    );

  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    titleText: {
      fontSize: 24,
      marginBottom: 10
    },
    loginButtonLabel: {
      fontSize: 22
    },
    navButtonText: {
      fontSize: 16
    }
  });