import React, { Component } from "react";
import { Col, Container, Row } from "native-base";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";


export default SearchTextInput = (props) => {


    return (
        <Row style={{
            backgroundColor: '#FAFAFB',
            height: 50,
            borderRadius: 80,
            marginHorizontal: 10,
            borderWidth: 2,
            borderColor: '#000',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: 15,
            borderWidth:0

        }}>
            <TouchableOpacity>
                <Col style={{ height: 40, paddingTop: 10, paddingRight:10}}>
                    <Entypo
                        name="attachment"
                        style={{
                            color: '#0e92be',
                        }}
                        size={24}
                    />
                </Col>
            </TouchableOpacity>
            <Col style={{ width: '75%', paddingLeft: 10, }}>
                <TextInput
                    style={styles.textInput}
                    multiline={true}
                    placeholder={"Type a message"}
                    placeholderTextColor='#8E9DA5'
                    onChangeText={() => props.onChangeText()}
                    onSubmitEditing = {()=> props.onSubmitEdithing()}
                    
                />

            </Col>

        </Row>
    )

}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderRadius: 5,
        paddingLeft: 10,
        color: 'black'
    }
});