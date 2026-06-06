import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'

export default function Add({ navigation }) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
    const [cameraPermission, requestCameraPermission] = useCameraPermissions()
    const cameraRef = useRef(null)
    const [image, setImage] = useState(null)
    const [facing, setFacing] = useState('back')

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermission(galleryStatus.status === 'granted')
        })()
    }, [])

    const takePicture = async () => {
        if (cameraRef.current) {
            const data = await cameraRef.current.takePictureAsync(null)
            setImage(data.uri)
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    if (!cameraPermission) return <View />

    if (!cameraPermission.granted) {
        return (
            <View style={styles.permissionScreen}>
                <FontAwesome5 name="camera" size={56} color="#ccc" />
                <Text style={styles.permissionTitle}>Camera Access Needed</Text>
                <Text style={styles.permissionText}>Allow camera access to take photos</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestCameraPermission}>
                    <Text style={styles.permissionBtnText}>Allow Camera</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (image) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: image }} style={styles.preview} />
                <View style={styles.previewActions}>
                    <TouchableOpacity style={styles.retakeBtn} onPress={() => setImage(null)}>
                        <FontAwesome5 name="redo" size={18} color="#333" />
                        <Text style={styles.retakeText}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={() => navigation.navigate('Uploadbut', { image })}>
                        <Text style={styles.nextText}>Next</Text>
                        <FontAwesome5 name="arrow-right" size={18} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
            />
            <View style={styles.controls}>
                <TouchableOpacity style={styles.sideBtn} onPress={pickImage}>
                    <FontAwesome5 name="images" size={24} color="#fff" />
                    <Text style={styles.sideBtnText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shutter} onPress={takePicture}>
                    <View style={styles.shutterInner} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sideBtn} onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}>
                    <Ionicons name="camera-reverse" size={28} color="#fff" />
                    <Text style={styles.sideBtnText}>Flip</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    camera: { flex: 1 },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#000',
    },
    shutter: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    shutterInner: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#fff',
    },
    sideBtn: { alignItems: 'center', minWidth: 60 },
    sideBtnText: { color: '#fff', fontSize: 11, marginTop: 4 },
    preview: { flex: 1 },
    previewActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#000',
    },
    retakeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    retakeText: { color: '#fff', fontWeight: '600', fontSize: 15 },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    nextText: { color: '#000', fontWeight: '700', fontSize: 15 },
    permissionScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 32,
    },
    permissionTitle: { fontSize: 22, fontWeight: '800', marginTop: 20, marginBottom: 8 },
    permissionText: { fontSize: 15, color: '#777', textAlign: 'center', marginBottom: 28 },
    permissionBtn: {
        backgroundColor: '#000',
        borderRadius: 10,
        paddingHorizontal: 32,
        paddingVertical: 14,
    },
    permissionBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
