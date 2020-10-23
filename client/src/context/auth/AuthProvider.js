import React, {useReducer} from 'react';
import AsyncStorage from '../../helpers/AsyncStorage';
//import {log, setAuthToken} from '../../commons/Commons';
import Services from '../../connectivity/Superagent'
import { useNavigation } from '@react-navigation/native';

import * as TYPES from '../types';
import AuthContext from './AuthContext';
import AuthReducer from './AuthReducer';
import { Alert } from 'react-native';

const AuthProvider = ({children}) => {


  const initialState = {
    user: null,
    loading: false,
    stepperIndex: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const loginUser = async (email, password) => {
    try {
      startLoading();
      const res = await Services.login(email, password, async (res, err) => {
        console.log(res)

        if (res != null) {
          //let result = JSON.parse(res)
         // let userID = result.userId
          const userSaved = await AsyncStorage.setUserLogin(res);
          //await AsyncStorage.setUserId(userID)
  
          if (userSaved) {
            //setAuthToken(res.Data.ZingerInfo.Token);
            dispatch({type: TYPES.LOGIN_USER, payload: res});
            console.log("You're successfully logged in!");
          }
        }
          else if (res == null) {
            //Toast.error(res.Message[0]);
            stopLoading();
          } else {
            somethingWentWrong();
            stopLoading();
          }
        
      });

    
       
    } catch (error) {
      console.log('Error Logging in', error);
      stopLoading();
      somethingWentWrong();
    }
  };

  const signUpUser = async (username, email, password, password2) => {
    console.log('COminggg:', username,email, password, password2)
    try {
      startLoading();
      const res = await Services.registerUser(username, email, password, password2,(res, err) => {
        console.log(res)

        if (res != null) {
          console.log(res)
          Alert.alert('User Registeration Successful')
        }
          else if (err) {
            console.log('Error ==>', err)
          //  let Message = 
          //  console.log('Error ==>', Message )
            Alert.alert(err.email)
            stopLoading();
          } else {
            somethingWentWrong();
            stopLoading();
          }
        
      });

    
       
    } catch (error) {
      console.log('Error Logging in', error);
      stopLoading();
      somethingWentWrong();
    }
  };


  const logout = async ({user}, onSuccess) => {
    await AsyncStorage.clear()

    dispatch({type: TYPES.LOGOUT, payload: user});
    onSuccess;
    console.log('Logged out successfully!')
  }

  const setUser = user => {
    //setAuthToken(user?.Token);
    dispatch({type: TYPES.SET_USER, payload: user});
  };


  // Private Methods
  const startLoading = () => dispatch({type: TYPES.START_LOADING});
  const stopLoading = () => dispatch({type: TYPES.STOP_LOADING});
  const somethingWentWrong = () => console.log('Something went wrong!');
  const getUser = () => state.user;

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        setUser,
        loginUser,
        signUpUser,
        logout
        
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
