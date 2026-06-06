import React, { Component } from 'react'
import { View, Button, TextInput, Text, StyleSheet, ActivityIndicator } from 'react-native'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            loading: false,
            error: null
        }
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        this.setState({ loading: true, error: null });
        const { email, password, name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                return firebase.firestore()
                    .collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({ name, email });
            })
            .catch((error) => {
                this.setState({ loading: false, error: error.message });
            });
    }

    render() {
        const { loading, error } = this.state;
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="username"
                    onChangeText={(name) => this.setState({ name })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                {loading
                    ? <ActivityIndicator size="small" color="#000" />
                    : <Button onPress={this.onSignUp} color="#000" title="Sign Up" />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 12
    },
    error: { color: 'red', marginBottom: 12, textAlign: 'center' }
})

export default Register
