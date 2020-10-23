import React from 'react';
import { StyleSheet, Dimensions, Text, TouchableOpacity, View, StatusBar  } from 'react-native';
import { Left, Right, Body, Title, Button, Header, } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('screen');

export default function CustomHeader(props) {

    console.log('Props', props)

  const  renderBackIcon = () => {
        if (!props.hideBackButton) {
            return (
                <TouchableOpacity
                    onPress={() => props.onBackPressed()}>
                    <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                        <Icon
                            name="angle-left"
                            type="solid" color="#fff"
                            size={24}
                        />
                    </View>
                </TouchableOpacity>
            )
        }

    };
   
    let right = null;
    if (props.rightComponent != null) {
        right = props.rightComponent;
    }

    return (
       <View>
        <Header noShadow={true} style={{backgroundColor:'#0e92be',borderBottomWidth: 0}}>
            <Left style={{ flexDirection: "row", alignItems: "center", flex: 2 }}>
                        {renderBackIcon()}
                        <Title style={{
                            fontSize: 24,
                            color: "#fff",
                            marginHorizontal: 10,
                            fontWeight: "bold",
                            letterSpacing: -1,
                            marginLeft: 20
                        }}>{props.headerText}</Title>
                    </Left>

                    <Right style={{ marginRight: 10 }}>
                        {right}
                    </Right>
           
        </Header>
         <StatusBar
         barStyle="light-content"
         // dark-content, light-content and default
         hidden={false}
         //To hide statusBar
         backgroundColor="#0e92be"
         //Background color of statusBar only works for Android
         translucent={false}
         //allowing light, but not detailed shapes
         networkActivityIndicatorVisible={true}
     />
     </View>
    );
}

const styles = StyleSheet.create({
                button: {
                marginTop: 10
    },
    buttonContainer: {
                width: width / 2,
        height: height / 15
    }
});