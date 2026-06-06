import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

export default function Landing({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesome5 name='fire' size={50} color="#000" />
            <Text style={{ textAlignVertical: "center", textAlign: "center", fontSize: 35, fontWeight: 'bold', height: 300 }} >
                SOLENT INSPIRE
            </Text>
            <Button
                color="#000"
                title="Login"
                onPress={() => navigation.navigate("Login")} />
            <Button
                color="#000"
                title="Register"
                onPress={() => navigation.navigate("Register")} />
        </View>
    )
}
