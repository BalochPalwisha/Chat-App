
import React, { Component } from 'react';
import { Button, TouchableOpacity, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Player, Recorder, MediaStates } from '@react-native-community/audio-toolkit';
import Icon from 'react-native-vector-icons/Ionicons';


export default class AudioRecorder extends Component {
    player = Player | null;
    lastSeek = 0;
    _progressInterval = null;

    constructor(props) {
        super(props);

        this.state = {
            playPauseButton: 'Preparing...',
            recordButton: 'Preparing...',

            stopButtonDisabled: true,
            playButtonDisabled: true,
            recordButtonDisabled: true,

            loopButtonStatus: false,
            progress: 0,

            error: null,
            iconName: "ios-play",
            duration: 0
        };
        console.log('Propsss', this.props)
    }

    componentWillMount() {
        this.player = null;
        this.lastSeek = 0;

        this._reloadPlayer();


        this._progressInterval = setInterval(() => {
            if (this.player && this._shouldUpdateProgressBar()) {
                let currentProgress = Math.max(0, this.player.currentTime) / this.player.duration;
                if (isNaN(currentProgress)) {
                    currentProgress = 0;
                }
                this.setState({ progress: currentProgress });
            }
        }, 100);
    }

    componentWillUnmount() {
        clearInterval(this._progressInterval);
    }

    _shouldUpdateProgressBar() {
        // Debounce progress bar update by 200 ms
        return Date.now() - this.lastSeek > 200;
    }

    _updateState(err) {
        this.setState({
            iconName: this.player && this.player.isPlaying ? "ios-pause" : "ios-play",

            //   stopButtonDisabled: !this.player || !this.player.canStop,
            playButtonDisabled: !this.player || !this.player.canPlay,
            //   recordButtonDisabled: !this.recorder || (this.player && !this.player.isStopped),
        });
    }

    _playPause() {
        this.player.playPause((err, paused) => {
            if (err) {
                this.setState({
                    error: err.message
                });
            }
            this._updateState();
        });
    }

    _stop() {
        this.player.stop(() => {
            this._updateState();
        });
    }

    _seek(percentage) {
        if (!this.player) {
            return;
        }

        this.lastSeek = Date.now();

        let position = percentage * this.player.duration;

        this.player.seek(position, () => {
            this._updateState();
        });
    }

    _reloadPlayer() {

        console.log('propsFilePath', this.props)

        if (this.player) {
            this.player.destroy();
        }

        this.player = new Player(this.props.filepath, {
            autoDestroy: false
        }).prepare((err) => {

            console.log('Duration', this.player.duration)
            this.setState({ duration: this.player.duration })


            if (err) {
                console.log('error at _reloadPlayer():');
                console.log(err);
            } else {
                this.player.looping = this.state.loopButtonStatus;
            }

            this._updateState();
        });

        this._updateState();

        this.player.on('ended', () => {
            this._updateState();
        });
        this.player.on('pause', () => {
            this._updateState();
        });
    }

    getAudioTimeString(sec) {

        var minutes = Math.floor(sec / 60000);
        var seconds = ((sec % 60000) / 1000).toFixed(0);
        var hours = Math.floor(sec / (1000*60*60))
        return   (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

       // return ((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
    }



    render() {

        const currentTimeString = this.getAudioTimeString(this.state.progress);
        const durationString = this.getAudioTimeString(this.state.duration);

        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', right: 20 }} >

                    <TouchableOpacity onPress={() => this._playPause()} style={{ marginHorizontal: 20 }}>
                        <Icon name={this.state.iconName} color="#0e92be" size={30} />
                    </TouchableOpacity>

                    <Slider
                        style={{ width: 200, right: 20 }}
                        minimumTrackTintColor="#0e92be"
                        maximumTrackTintColor="#000000"
                        thumbTintColor="#0e92be"
                        step={0.0001}
                        disabled={this.state.playButtonDisabled}
                        onValueChange={(percentage) => this._seek(percentage)}
                        value={this.state.progress} />

                </View>
                <Text style={{ color: '#3F3D56', left: this.props.user == true ? 40 : 185, bottom: 2, fontSize: 10 }}>{durationString}</Text>
            </View>
        );
    }
}
AudioRecorder.State = {
    playPauseButton: String,
    recordButton: String,

    stopButtonDisabled: Boolean,
    playButtonDisabled: Boolean,
    recordButtonDisabled: Boolean,

    loopButtonStatus: Boolean,
    progress: Number,

    error: String | null
};

AudioRecorder.props = {};

const styles = StyleSheet.create({
    slider: {
        height: 10,
        margin: 10,
        marginBottom: 50,
    },
    settingsContainer: {
        alignItems: 'center',
    },
    container: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    title: {
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
    },
    errorMessage: {
        fontSize: 15,
        textAlign: 'center',
        padding: 10,
        color: 'red'
    }
})