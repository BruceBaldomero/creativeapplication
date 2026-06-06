import React, { Component } from 'react'
import { View, TextInput, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const friendlyError = (code) => {
    switch (code) {
        case 'auth/invalid-email': return 'Please enter a valid email address.'
        case 'auth/user-not-found': return 'No account found with that email.'
        case 'auth/wrong-password': return 'Incorrect password. Try again.'
        case 'auth/invalid-credential': return 'Incorrect email or password.'
        case 'auth/too-many-requests': return 'Too many attempts. Try again later.'
        case 'auth/network-request-failed': return 'Network error — check your connection.'
        default: return 'Something went wrong. Please try again.'
    }
}

export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = { email: '', password: '', loading: false, error: null }
        this.onSignIn = this.onSignIn.bind(this)
    }

    onSignIn() {
        this.setState({ loading: true, error: null })
        const { email, password } = this.state
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((error) => {
                this.setState({ loading: false, error: friendlyError(error.code) })
            })
    }

    render() {
        const { loading, error } = this.state
        return (
            <View style={styles.container}>
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
                    placeholder="Your password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {loading
                    ? <ActivityIndicator size="large" color="#000" style={{ marginTop: 16 }} />
                    : (
                        <TouchableOpacity style={styles.button} onPress={this.onSignIn}>
                            <Text style={styles.buttonText}>Sign In</Text>
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

export default Login
