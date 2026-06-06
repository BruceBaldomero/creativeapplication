import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const Avatar = ({ name, size = 44 }) => {
    const initials = name ? name.slice(0, 2).toUpperCase() : '?'
    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
        </View>
    )
}

export default function Search(props) {
    const [users, setUsers] = useState([])
    const [query, setQuery] = useState('')

    const fetchUsers = (search) => {
        setQuery(search)
        if (!search.trim()) {
            setUsers([])
            return
        }
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .where('name', '<=', search + '')
            .get()
            .then((snapshot) => {
                const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setUsers(users)
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Search</Text>
            </View>
            <View style={styles.searchBar}>
                <FontAwesome5 name="search" size={16} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search users..."
                    placeholderTextColor="#aaa"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={query}
                    onChangeText={fetchUsers}
                />
            </View>

            {query.length === 0 ? (
                <View style={styles.empty}>
                    <FontAwesome5 name="user-friends" size={48} color="#ddd" />
                    <Text style={styles.emptyText}>Search for users</Text>
                </View>
            ) : users.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No users found</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.userRow}
                            onPress={() => props.navigation.navigate("Profile", { uid: item.id })}>
                            <Avatar name={item.name} />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{item.name}</Text>
                                {item.email ? <Text style={styles.userEmail}>{item.email}</Text> : null}
                            </View>
                            <FontAwesome5 name="chevron-right" size={14} color="#ccc" />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    header: {
        backgroundColor: '#fff',
        paddingTop: 52,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: { fontSize: 22, fontWeight: '800' },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        paddingHorizontal: 12,
    },
    searchIcon: { marginRight: 8 },
    input: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#222' },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 12,
        marginBottom: 8,
        borderRadius: 10,
    },
    avatar: {
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: { color: '#fff', fontWeight: '700' },
    userInfo: { flex: 1 },
    userName: { fontWeight: '700', fontSize: 15 },
    userEmail: { fontSize: 12, color: '#999', marginTop: 2 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 15, color: '#aaa', marginTop: 16 },
})
