import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, Platform, ToastAndroid, RefreshControlBase, Dimensions, PermissionsAndroid, Alert } from 'react-native';
import Slider from 'react-native-slider';
import Sound from "react-native-sound";
import Icon from 'react-native-vector-icons/Ionicons'
import soundHelper from '../helpers/SoundHelper';

let intervalIndex = 0

const SoundComponent = (props) => {

    console.log('propsssUser', props.user)

    const [currentTime, setCurrentAudioTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playState, setPlayState] = useState('pause')
    const [tempTime, setTempTime] = useState(0);
    const [timeStr, setTimeStr] = useState(0)



    var sound = new Sound(props.filepath, "", (error) => {
        if (error) {
            console.log('failed to load the sound', error);
            //Alert.alert('Notice', 'audio file error. (Error code : 1)');
            setPlayState('pause');
            return;
        }
        else {

            setDuration(sound.getDuration())
        }
        // loaded successfully
        // console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getCurrentTime((seconds) => console.log('at ' + seconds)))

    });


    const playSound = async () => {

        await setTimeout(() => {

            sound.play()
            let duration = sound.getDuration()
            setDuration(duration);
            console.log("Duration Of Track: " + duration);

            clearInterval(intervalIndex);
            console.log('start IntervalIndex', intervalIndex)


            let iInetrvalIndex = setInterval(() => {

                sound.getCurrentTime((seconds, isPlaying) => {
                    console.log(" Seconds: " + seconds + " - Duration: " + duration);
                    let iPercentage = ((seconds * 100) / duration) / 100;
                    console.log(iPercentage);
                    // console.log(((seconds+1*100)/duration)/10+"seonds"+seconds+"duration"+duration)
                    setCurrentAudioTime(iPercentage);

                })

            }, 100)



            console.log('end IntervalIndex', iInetrvalIndex)
            //setIntervalIndex(iInetrvalIndex)
            intervalIndex = iInetrvalIndex



        }, 500);

    }

    const pauseSound = async () => {
        console.log('Stateeee:', playState)
        await sound.pause(() => {
            alert('there')
        });
        setPlayState('pause');
        alert('hi')
    }

    const playCompleted = (success) => {

        if (success) {
            console.log('successfully finished playing');

        } else {
            console.log('playback failed due to audio decoding errors');
        }
        setPlayState('pause');
        setCurrentAudioTime(0)
        return clearInterval(intervalIndex);
    }

    const getAudioTimeString = (seconds) => {

        const h = parseInt(seconds / (60 * 60));
        const m = parseInt(seconds % (60 * 60) / 60);
        const s = parseInt(seconds % 60);

        return ((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
    }

    const onSlide = (value) => {
   
        console.log('slider start', value)
        soundHelper.soundSetCurrentTime(value)
        setCurrentAudioTime(value);

    }

    const play = () => {

        soundHelper.playSound(props.filepath, (d, res, err) => {
            console.log("Duration Of Track: " + d + "timeeeee----", res);
            if (res == "success") {
                setPlayState('pause');
                setCurrentAudioTime(0)
                setTimeStr(0)
                removerInterval();
            }
            else {
                console.log(err)
            }
        })


        setDuration(duration);
        clearInterval(intervalIndex);
        //console.log('start IntervalIndex', intervalIndex)
        let iInetrvalIndex = setInterval(() => {

            soundHelper.soundCurrentTime((seconds) => {
                console.log(" Seconds: " + seconds + " - Duration: " + duration);
               // let iPercentage = ((seconds * 100) / duration) / 100;
                //console.log(iPercentage);
                // console.log(((seconds+1*100)/duration)/10+"seonds"+seconds+"duration"+duration)
                setCurrentAudioTime(seconds);
                setTimeStr(seconds);

            })

        }, 100)

         
        console.log('end IntervalIndex', iInetrvalIndex)
        intervalIndex = iInetrvalIndex
    }





    const pause = () => {
        console.log('ccc', currentTime)
        soundHelper.pauseSound()
        setPlayState('played');
        clearInterval(intervalIndex);
        setTempTime(currentTime)
    }

    const removerInterval = () => {
        return clearInterval(intervalIndex)
        
    }

    const resume = () => {
        console.log('playinggggg')
        soundHelper.resumeSound((success) => {
            console.log("resssssumeee",success)
          if(success){
            setPlayState('pause');
            setCurrentAudioTime(0)
            setTimeStr(0)
            removerInterval();
          }else{
              console.log('not success!')
          }
        });


      let ind = setInterval(()=> {
            soundHelper.soundCurrentTime((seconds) => {
                console.log(" Seconds: " + seconds + " - Duration: " + duration);
                //let iPercentage = (((seconds + tempTime) * 100) / duration) / 100;
                //console.log(iPercentage);
                // console.log(((seconds+1*100)/duration)/10+"seonds"+seconds+"duration"+duration)
                setCurrentAudioTime(seconds);
                setTimeStr(seconds)
            })
        })

        intervalIndex = ind
       
    }

   


    const currentTimeString = getAudioTimeString(currentTime);
    const durationString = getAudioTimeString(duration);

    console.log("currentTimeString", currentTime)
    console.log("durationString", currentTimeString)

    console.log('CurrentState', playState);
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', right: 20 }} >
                {playState == "pause" || playState == "played"  ?
                    <TouchableOpacity onPress={() => { setPlayState('playing'),  (playState == "played") ? resume() :  play() }} style={{ marginHorizontal: 20 }}>
                        <Icon name={"ios-play"} color="#0e92be" size={30} />
                    </TouchableOpacity> : (playState == "playing")
                        ?
                        <TouchableOpacity onPress={() => pause() } style={{ marginHorizontal: 20 }}>
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
                    onValueChange={onSlide}


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