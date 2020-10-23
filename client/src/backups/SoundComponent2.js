import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, Platform, ToastAndroid, RefreshControlBase, Dimensions, PermissionsAndroid, Alert } from 'react-native';
import Slider from 'react-native-slider';
import Sound from "react-native-sound";
import Icon from 'react-native-vector-icons/Ionicons'
import soundHelper from '../helpers/SoundHelper';

let intervalIndex = 0

const SoundComponent = (props) => {

   // console.log('propsssUser', props.filepath)

    const [currentTime, setCurrentAudioTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playState, setPlayState] = useState('pause')
    const [tempTime, setTempTime] = useState(0);
    const [timeStr, setTimeStr] = useState(0);
    const [intervalInd, setIntervalInd] = useState(0);



    const getAudioTimeString = (seconds) => {

        const h = parseInt(seconds / (60 * 60));
        const m = parseInt(seconds % (60 * 60) / 60);
        const s = parseInt(seconds % 60);

        return ((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
    }



    const onSlide = (value) => {
        alert("slider start")
        console.log('slider start', value)
        soundHelper.soundSetCurrentTime(value)
        setCurrentAudioTime(value);

    }

    const play = () => {



        soundHelper.playSound(props.filepath, (d, res, err) => {
            console.log("Duration Of Track: " + d + "timeeeee----", res);
            setPlayState('playing')
            setDuration(d)
            if (res == "success") {
                setPlayState('pause');
                setCurrentAudioTime(0)
                removerInterval();
            }
            else {
                console.log(err)
            }

        })



        clearInterval(intervalIndex);

        let iInetrvalIndex = setInterval(() => {

            soundHelper.soundCurrentTime((seconds) => {
                console.log(" Seconds: " + seconds);
                setCurrentAudioTime(seconds);


            })

        }, 100)

        intervalIndex = iInetrvalIndex

    }



    // const pause = () => {
    //     console.log('ccc', currentTime)
    //     soundHelper.pauseSound()
    //     setPlayState('played');
    //     clearInterval(intervalIndex);
    //     setTempTime(currentTime)
    // }

    const removerInterval = () => {
        console.log('interval', intervalIndex)
        return clearInterval(intervalIndex)

    }





    const currentTimeString = getAudioTimeString(currentTime);
    const durationString = getAudioTimeString(duration);

    console.log('CurrentState', playState);
    console.log('Duration', duration);
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', right: 20 }} >
                {playState == "pause" || playState == "played" ?
                    <TouchableOpacity onPress={() => { play() }} style={{ marginHorizontal: 20 }}>
                        <Icon name={"ios-play"} color="#0e92be" size={30} />
                    </TouchableOpacity> : (playState == "playing")
                        ?
                        <TouchableOpacity onPress={() => pause()} style={{ marginHorizontal: 20 }}>
                            <Icon name={"ios-pause"} color="#0e92be" size={30} />
                        </TouchableOpacity> : null
                }



                <Slider
                    // slier input is 0 - 1 only so we want to convert sec to 0 - 1
                    style={{ width: 180, right: 10 }}
                    thumbStyle={styles.thumb}
                    trackStyle={styles.track}
                    minimumTrackTintColor='#0e92be'
                    value={currentTime}
                    disabled
                    maximumValue={duration}
                    onValueChange={value => onSlide(value)}


                />

            </View>
            <Text style={{ color: '#3F3D56', left: props.user == true ? 40 : 185, bottom: 5, fontSize: 10 }}>{playState == 'playing' ? currentTimeString : durationString}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
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
})

export default SoundComponent;