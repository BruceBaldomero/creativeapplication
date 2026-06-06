import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { connect } from 'react-redux'

const Avatar = ({ name, size = 80 }) => {
    const initials = name ? name.slice(0, 2).toUpperCase() : '?'
    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
        </View>
    )
}

function Profile(props) {
    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        const { currentUser, posts } = props

        if (firebase.auth().currentUser && props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        } else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) setUser(snapshot.data())
                })

            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    setUserPosts(posts)
                })
        }

        setFollowing(props.following.indexOf(props.route.params.uid) > -1)
    }, [props.route.params.uid, props.following])

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }

    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    const onLogout = () => {
        firebase.auth().signOut()
    }

    if (user === null) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    const isOwnProfile = firebase.auth().currentUser && props.route.params.uid === firebase.auth().currentUser.uid

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={() => (
                    <View>
                        <View style={styles.profileHeader}>
                            <Avatar name={user.name} size={80} />
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>{user.name}</Text>
                                <Text style={styles.profileEmail}>{user.email}</Text>
                                <Text style={styles.postCount}>
                                    {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.actionRow}>
                            {isOwnProfile ? (
                                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                                    <Text style={styles.logoutText}>Log Out</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={following ? styles.unfollowBtn : styles.followBtn}
                                    onPress={following ? onUnfollow : onFollow}>
                                    <Text style={following ? styles.unfollowText : styles.followText}>
                                        {following ? 'Following' : 'Follow'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {userPosts.length === 0 && (
                            <View style={styles.empty}>
                                <FontAwesome5 name="camera" size={40} color="#ccc" />
                                <Text style={styles.emptyText}>No posts yet</Text>
                            </View>
                        )}
                    </View>
                )}
                numColumns={3}
                data={userPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.gridItem}>
                        <Image style={styles.gridImage} source={{ uri: item.downloadURL }} />
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
    },
    avatar: {
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
    },
    avatarText: { color: '#fff', fontWeight: '700' },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
    profileEmail: { fontSize: 13, color: '#888', marginBottom: 6 },
    postCount: { fontSize: 13, color: '#555', fontWeight: '600' },
    actionRow: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    followBtn: {
        backgroundColor: '#000',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    followText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    unfollowBtn: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    unfollowText: { color: '#333', fontWeight: '700', fontSize: 14 },
    logoutBtn: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    logoutText: { color: '#cc0000', fontWeight: '700', fontSize: 14 },
    gridItem: { flex: 1 / 3, aspectRatio: 1, padding: 1 },
    gridImage: { flex: 1 },
    empty: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { color: '#aaa', fontSize: 15, marginTop: 12 },
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})
export default connect(mapStateToProps, null)(Profile)
