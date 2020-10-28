import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Video from 'react-native-video'
import React, { useContext, useEffect, useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; // and this
import Slider from '@react-native-community/slider';
import { Container, Header, Left, Title } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

export default VideoComponent = (props) => {

  console.log('props:', props)

  let video = null
  let overlayTimer = null

  const [isPaused, setPause] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0.1);
  const [overlay, setOverlay] = useState(false);
  const [showIcon, setShowIcon] = useState(false)





  const load = ({ duration }) => setDuration(duration) // now here the duration is update on load video

  const progress = (currentTime) => {
    setCurrentTime(currentTime.currentTime)

  }


  const getTime = t => {
    const digit = n => n < 10 ? `0${n}` : `${n}`;
    // const t = Math.round(time);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));
    return min + ':' + sec; // this will convert sec to timer string
    // 33 -> 00:00:33
    // this is done here
    // ok now the theme is good to look
  }
  const onslide = slide => {
    video.seek(slide * duration); // here the upation is maked for video seeking
    clearTimeout(overlayTimer);
    overlayTimer = setTimeout(() => { setOverlay(false) }, 3000);
  }
  const onEnd = () => {
    setShowIcon(true);
    setPause(true);
  }

  return (

    <View style={{ flex: 1, }}>

      <Header noShadow={true} style={{ backgroundColor: '#000', borderBottomWidth: 0, marginHorizontal:10 }}>
        <Left style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View>
            <FontAwesome
              name="angle-left"
              type="solid" color="#fff"
              size={30}
              onPress={()=> props.navigation.goBack()}
            />
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: '10%'}}>
            <Text style={{ color: '#fff', fontSize:22, fontWeight:'500' }}>{props.route.params.username}</Text>
            <Text style={{ color: '#fff',fontSize:14, fontWeight:'300'  }} >{props.route.params.mDate}</Text>
          </View>

        </Left>
      </Header>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", backgroundColor: '#000' }}>
 
        <Video source={{ uri: props.route.params.link }}   // Can be a URL or a local file.
          // fullscreen={fullscreen}
          paused={isPaused} // this will manage the pause and play
          ref={(ref) => { video = ref }}
          resizeMode={"contain"}
          onLoad={load}
          onProgress={progress}
          repeat={true}
          onEnd={onEnd}
          style={style.video}

        />
           {showIcon ? 
          <View>

            <Icon name={isPaused ? 'play-circle-outline' : 'ios-pause-circle-outline'} style={style.icon} onPress={() => setPause(!isPaused)} />

          </View> : null}



        <View style={style.sliderCont}>
          <View style={style.timer}>
            <Text style={{ color: 'white' }}>{getTime(currentTime)}</Text>
            <Text style={{ color: 'white' }}>{getTime(duration)} </Text>
          </View>
          <Slider
            // we want to add some param here
            maximumTrackTintColor='#ccc'
            minimumTrackTintColor='#0e92be'
            thumbTintColor='#0e92be' // now the slider and the time will work
            value={currentTime / duration} // slier input is 0 - 1 only so we want to convert sec to 0 - 1
            onValueChange={onslide}
          />
        </View>

      </View>
      </View>
  )
}

const style = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 5

  },
 
  icon: {
    color: '#ccc',
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 60,
     marginTop: '75%',
 
  },
  sliderCont: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '5%',
    width: '95%',
    marginLeft: '2%',
    alignSelf: 'center'

  },
  timer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5
  },

  video: { 
     ...StyleSheet.absoluteFill,
       marginBottom:'25%',
       marginTop:0
    },

})