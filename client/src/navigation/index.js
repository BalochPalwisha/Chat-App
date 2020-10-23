import React, {useEffect, useState} from 'react';
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
    useTheme,
  } from '@react-navigation/native';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import Loading from '../components/Loading';
import AsyncStorage from '../helpers/AsyncStorage';
import useAuth from '../hooks/useAuth';

  export default function AppNavigator () {

    const [loading, setLoading] = useState(true);
    const {user, setUser} = useAuth();

    const initialize = async () => {
        let savedUser = await AsyncStorage.getUser();
        setUser(savedUser);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      };


    useEffect(() => {
        initialize();
      
      }, []);

      if (loading) {
        return <Loading />;
      }

    return(
        <NavigationContainer>
           {user ? <HomeStack/> : <AuthStack/> }
        </NavigationContainer>
    )

  }