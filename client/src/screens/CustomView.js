import React, { useState } from 'react'
import PropTypes from 'prop-types';

import {
    View,
    WebView,
    Image,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewPropTypes
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FileDownload from '../components/FileDownload';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


export default function CustomView(props) {

    const [isDownload, setIsDownload] = useState("stop");
    const [percentage, setPercentage] = useState(0);

    console.log('Messages propss:', props)

    function renderPdf() {

        let file = props.currentMessage.file
        let fileName = file.split("/")
        console.log('FileName', fileName)
        let fname = fileName[4]


        let iconName = ""
        let iconColor = ""

        if (file.includes('.pdf')) {
            iconName = "file-pdf"
            iconColor = "red"
        }


        if (file.includes('.pptx') || file.includes('.ppt')){
            iconName = "file-powerpoint"
            iconColor = "orange"
        }
            

        if (file.includes('.docx') || file.includes('.doc')){
            iconName = "file-word"
            iconColor = "blue"
        }
           
        if (file.includes('.xls') || file.includes('.xlsx')){
            iconName = "file-excel"
            iconColor = "green"
        }
            

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                <View>
                    <MaterialIcon name={iconName} size={26} color={iconColor} />
                </View>
                <TouchableOpacity onPress={() => {
                    setIsDownload("start"),
                        FileDownload(props.currentMessage.file, fname, (progress) => {
                            setPercentage(progress);
                        })
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ color: isDownload == "completed" ? "#3F3D56" : '#0e92be', fontSize: 18 }}> {(fname.length > 20) ? fname.substring(0, 20 - 3) + '...' : fname } </Text>
                        {isDownload == "start" ?
                            <AnimatedCircularProgress
                                style={{ left: 5 }}
                                size={20}
                                width={17}
                                fill={percentage}
                                tintColor="green"
                                onAnimationComplete={() => setIsDownload("completed")}
                                backgroundColor="#00e0ff" />
                            :
                            <Icon name={isDownload == "completed" ? "checkmark-circle-outline" : "md-arrow-down-circle-outline"} size={25} color={isDownload == "completed" ? "#3F3D56" : '#0e92be'} style={{ left: 5 }} />
                        }

                    </View>
                </TouchableOpacity>
            </View>

        );
    }

    function renderHtml() {
        return (
            <TouchableOpacity style={[styles.container, props.containerStyle]} onPress={() => {
                Actions.chat_html({ properties: props.currentMessage });
            }}>
                <Image
                    {...props.imageProps}
                    style={[styles.image, props.imageStyle]}
                    source={{ uri: props.currentMessage.image }}
                />
            </TouchableOpacity>
        );
    }





    if (props.currentMessage.file) {
        return renderPdf();
    } else if (props.currentMessage.template && props.currentMessage.template != 'none') {
        return renderHtml();
    }
    return null;



}

const styles = StyleSheet.create({
    container: {
    },
    mapView: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
    },
    image: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover'
    },
    webview: {
        flex: 1,
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
});
CustomView.defaultProps = {
    mapViewStyle: {},
    currentMessage: {
        image: null,
        file_type: null,
        template: null,
        template_html: null,
    },
    containerStyle: {},
    imageStyle: {},
};

CustomView.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    mapViewStyle: ViewPropTypes.style,
    imageStyle: Image.propTypes.style,
    imageProps: PropTypes.object,
};
