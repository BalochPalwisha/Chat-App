import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';


const KEYS = {

    IS_LOGGED_IN: "IsUserLogin",
    USER_ID: 'userId',

   

};

/* Check User Login */

const setUserLogin = async (login) => {
    return set(KEYS.IS_LOGGED_IN, login);
};

const getUser = async () => {
    return get(KEYS.IS_LOGGED_IN);
};

const setUserId = async (id) => {
    return set(KEYS.USER_ID, id);
}
const getUserId = async () => {
    return get(KEYS.USER_ID)
}


/* These are general functions, no need to make any change in them */

const get = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            const value = AsyncStorage.getItem(key)
                .then((value) => {
                    resolve(value);
                });

        } catch (error) {
            reject(error);
            console.error(error);
        }

    })

};

const getAsObject = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            const value = AsyncStorage.getItem(key)
                .then((value) => {
                    resolve(JSON.parse(value));
                });

        } catch (error) {
            reject(error);
            console.error(error);
        }

    })

};


const set = async (key, data) => {
    let result = false;
    try {
        await AsyncStorage.setItem(key, data);
        console.log("Saved " + data + " at key " + key);
        result = true;
    } catch (error) {
        console.error(error);
    }
    return result;
};

const clear = () => {
    AsyncStorage.clear();
};

export default {
    setUserLogin,
    getUser,
    clear,
    setUserId,
    getUserId
}