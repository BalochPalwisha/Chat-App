import ImagePicker from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';


export const handleChoosePhoto = async (callback) => {


    if (Platform.OS == "android") {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Chat App Camera Permission",
                    message:
                        "ChatApp needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");

            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }

         choosePhoto((source)=> {
            callback(source)
         });
         ;
     }
    else {
        choosePhoto((source)=> {
            callback(source)
        });
    }


};

const choosePhoto = (callback) => {
    const options = {
        noData: true,
    };

    ImagePicker.showImagePicker(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            //const source = { uri: response };

            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };

            callback(response);
            //     let axiosConfig = {
            //       headers: {
            //         Authorization: 'Client-ID ead116aab30174c',
            //       },
            //       timeout: 8000,
            //     };

            //     let formData = new FormData();
            //     formData.append('image', source.uri);
            //     ToastAndroid.show('Uploading...', ToastAndroid.LONG);

            //     //upload to imgur
            //     axios
            //       .post('https://api.imgur.com/3/image', formData, axiosConfig)
            //       .then(res => {
            //         if (res.status === 200) {
            //           console.log(res.status);
            //           let {data} = res;
            //           // this.setState({imageURL: data.data.link});
            //           const id = this.state.messages.length + 1;
            //           let imageMsg = [
            //             {
            //               _id: id,
            //               text: '',
            //               createdAt: new Date(),
            //               user: {
            //                 _id: this.state.userId,
            //                 name: this.state.userName,
            //                 avatar: this.state.userPhoto,
            //               },
            //               image: data.data.link,
            //             },
            //           ];

            //           this.onSend(imageMsg);
            //           imageMsg = [];
            //         } else {
            //           ToastAndroid.show(
            //             'Uploading failed. Try again',
            //             ToastAndroid.SHORT,
            //           );
            //         }
            //       });
        }
    });
}