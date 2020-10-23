
import { PermissionsAndroid, Platform } from 'react-native'
import {AudioRecorder, AudioUtils} from 'react-native-audio';



const prepareRecordingPath = (audioPath) => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac",
        AudioEncodingBitRate: 32000
    });
}

 export const handleAudioAfterPermission = (audioPath, cb) => {

    requestPermision();

    AudioRecorder.requestAuthorization().then((isAuthorised) => {

        console.log('Authorised', isAuthorised)
        cb(isAuthorised)

        if (!isAuthorised) return;

        prepareRecordingPath(audioPath);

        AudioRecorder.onProgress = (data) => {
            console.log(data, "onProgress data");
        };

        AudioRecorder.onFinished = (data) => {
            // Android callback comes in the form of a promise instead.
            console.log(data, "onFinished data");
            if (Platform.OS === 'ios') {
                finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
            }
        };
    });


}

const requestPermision = async () => {
    if (Platform.OS !== "android") {
        return Promise.resolve(true);
    }
    else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: "Microphone Permission",
                    message:
                        "ChatApp needs access to your microphone ",

                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("permission granted");

            } else {
                console.log("permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    }
}

const finishRecording = (didSucceed, filePath, fileSize) => {
    console.log(`Finished recording of duration seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
}

export const record = async (hasPermission, recording, stoppedRecording, audioPath, cb) => {
    if (recording) {
        console.warn('Already recording!');
        return;
    }

    if (!hasPermission) {
        console.warn('Can\'t record, no permission granted!');
        return;
    }

    if (stoppedRecording) {
        prepareRecordingPath(audioPath);
    }

    let recordinggg = true
    cb(recordinggg)
    //this.setState({recording: true, paused: false});

    try {
        const filePath = await AudioRecorder.startRecording();
    } catch (error) {
        console.error(error);
    }
}

export const stop = async (recording, cb) => {
    if (!recording) {
        console.warn('Can\'t stop, not recording!');
        return;
    }
    let stoppedRecording = true
    let recordinggg = false

    cb(stoppedRecording, recordinggg)

    // this.setState({stoppedRecording: true, recording: false, paused: false});

    try {
        const filePath = await AudioRecorder.stopRecording();

        if (Platform.OS === 'android') {
            finishRecording(true, filePath);
        }
        //return filePath;
        
    } catch (error) {
        console.error(error);
    }
}