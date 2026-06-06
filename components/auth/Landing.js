import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

export default function Landing({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <View style={styles.iconWrap}>
                    <FontAwesome5 name='fire' size={48} color="#fff" />
                </View>
                <Text style={styles.title}>Solent Inspire</Text>
                <Text style={styles.subtitle}>Share your creativity with the world</Text>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.primaryText}>Create Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.secondaryText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        paddingVertical: 80,
        paddingHorizontal: 28,
    },
    hero: { alignItems: 'center', marginTop: 20 },
    iconWrap: {
        width: 96,
        height: 96,
        borderRadius: 24,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: { fontSize: 30, fontWeight: '800', letterSpacing: 1, marginBottom: 10 },
    subtitle: { fontSize: 15, color: '#777', textAlign: 'center', lineHeight: 22 },
    buttons: { gap: 12 },
    primary: {
        backgroundColor: '#000',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    secondary: {
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    secondaryText: { color: '#000', fontSize: 16, fontWeight: '600' },
})
