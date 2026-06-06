import React, { useState } from 'react'
import { View, TextInput, Image, Text, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

export default function Save(props) {
    const [caption, setCaption] = useState('')
    const [uploading, setUploading] = useState(false)

    const uploadImage = async () => {
        setUploading(true)
        const uri = props.route.params.image
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`

        const response = await fetch(uri)
        const blob = await response.blob()

        const task = firebase.storage().ref().child(childPath).put(blob)

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
            })
        }

        const taskError = () => {
            setUploading(false)
        }

        task.on("state_changed", null, taskError, taskCompleted)
    }

    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                props.navigation.popToTop()
            })
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Image source={{ uri: props.route.params.image }} style={styles.image} />
            <View style={styles.form}>
                <Text style={styles.label}>Add a caption</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Write something about your photo..."
                    placeholderTextColor="#aaa"
                    multiline
                    maxLength={200}
                    onChangeText={setCaption}
                    value={caption}
                />
                {uploading ? (
                    <View style={styles.uploadingRow}>
                        <ActivityIndicator size="large" color="#000" />
                        <Text style={styles.uploadingText}>Uploading...</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={uploadImage}>
                        <Text style={styles.buttonText}>Share Post</Text>
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    image: { width: '100%', aspectRatio: 1 },
    form: { padding: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        backgroundColor: '#fafafa',
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    uploadingRow: { alignItems: 'center', marginTop: 8 },
    uploadingText: { color: '#555', marginTop: 8, fontSize: 15 },
})
