import RNFetchBlob from 'react-native-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';


export default function FileDownload(Url, FileName , cb) {

    console.log("============================>>>" + Url)
    if (Platform.OS == "android") {
        let dirs = RNFetchBlob.fs.dirs.DownloadDir + '/' + FileName

        RNFetchBlob.fs.exists(dirs).then((exists) => {
            if (exists) {
                Alert.alert(
                    'File Already Exits',
                    'Open File',
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "Open", onPress: () => {

                                FileViewer.open(dirs, { showOpenWithDialog: true })
                                    .then(() => {
                                        // success
                                    })
                                    .catch(error => {
                                        // error
                                    });
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                RNFetchBlob
                    .config({
                        fileCache: true,
                        path: dirs,
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            description: 'File downloaded',
                            path: dirs,
                            mediaScannable: true,
                        }
                    })

                    .fetch('GET', Url, {})
                    .then((res) => {

                        Alert.alert(
                            "Download Successfull",
                            'Open File',
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                {
                                    text: "Open", onPress: () => {

                                        FileViewer.open(dirs, { showOpenWithDialog: true })
                                            .then(() => {
                                                // success
                                            })
                                            .catch(error => {
                                                // error
                                            });
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    })
            }
        }).catch((e) => { alert(e) })


    }
    else {
        let dirs = RNFetchBlob.fs.dirs.DocumentDir + '/' + FileName

        RNFetchBlob.fs.exists(dirs).then((exists) => {
            if (exists) {
                Alert.alert(
                    'File Already Exits',
                    'Open File',
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "Open", onPress: () => {

                                FileViewer.open(dirs, { showOpenWithDialog: true })
                                    .then(() => {
                                        // success
                                    })
                                    .catch(error => {
                                        // error
                                    });
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                RNFetchBlob
                    .config({
                        // response data will be saved to this path if it has access right.
                        path: dirs
                    })
                    .fetch('GET', Url, {
                        //some headers ..
                    }).progress({ count: 1 }, (received, total) => {
                        console.log('progress', received / total)
                        let prog = (received / total)*100
                        cb(prog);
                    })

                    .then((res) => {

                        console.log('ResponseFile:', res)

                        alert('File Download Succesfully')

                        RNFetchBlob.ios.openDocument(res.path())
                            .then(() => console.log('Previewing document', res.path()))
                            .catch((err) => console.error('Error opening document', err))
                    })
            }
        }).catch((e) => { alert(e) })

    }

}