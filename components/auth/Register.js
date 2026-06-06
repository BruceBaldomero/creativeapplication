import React, { Component } from 'react'
import { View, TextInput, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const friendlyError = (code) => {
    switch (code) {
        case 'auth/email-already-in-use': return 'An account with this email already exists.'
        case 'auth/invalid-email': return 'Please enter a valid email address.'
        case 'auth/weak-password': return 'Password must be at least 6 characters.'
        case 'auth/network-request-failed': return 'Network error — check your connection.'
        default: return 'Something went wrong. Please try again.'
    }
}

export class Register extends Component {
    constructor(props) {
        super(props)
        this.state = { email: '', password: '', name: '', loading: false, error: null }
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, name } = this.state
        if (!name.trim()) {
            this.setState({ error: 'Please enter a username.' })
            return
        }
        this.setState({ loading: true, error: null })
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                return firebase.firestore()
                    .collection('users')
                    .doc(firebase.auth().currentUser.uid)
                    .set({ name: name.trim(), email })
            })
            .catch((error) => {
                this.setState({ loading: false, error: friendlyError(error.code) })
            })
    }

    render() {
        const { loading, error } = this.state
        return (
            <View style={styles.container}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. ricksanchez"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(name) => this.setState({ name })}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={(email) => this.setState({ email })}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="At least 6 characters"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {loading
                    ? <ActivityIndicator size="large" color="#000" style={{ marginTop: 16 }} />
                    : (
                        <TouchableOpacity style={styles.button} onPress={this.onSignUp}>
                            <Text style={styles.buttonText}>Create Account</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#fff' },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: '#333' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#fafafa'
    },
    error: { color: '#cc0000', marginBottom: 12, textAlign: 'center', fontSize: 14 },
    button: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginTop: 8
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
})

export default Register
