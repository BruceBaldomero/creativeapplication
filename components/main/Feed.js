import React, { useState, useEffect } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import moment from 'moment'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { connect } from 'react-redux'

const Avatar = ({ name, size = 36 }) => {
    const initials = name ? name.slice(0, 2).toUpperCase() : '?'
    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
        </View>
    )
}

function Feed(props) {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            const sorted = [...props.feed].sort((x, y) => x.creation - y.creation)
            setPosts(sorted)
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts").doc(userId)
            .collection("userPosts").doc(postId)
            .collection("likes").doc(firebase.auth().currentUser.uid)
            .set({})
    }

    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts").doc(userId)
            .collection("userPosts").doc(postId)
            .collection("likes").doc(firebase.auth().currentUser.uid)
            .delete()
    }

    const renderPost = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Avatar name={item.user.name} />
                <Text style={styles.username}>{item.user.name}</Text>
            </View>
            <Image style={styles.image} source={{ uri: item.downloadURL }} />
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => item.currentUserLike
                        ? onDislikePress(item.user.uid, item.id)
                        : onLikePress(item.user.uid, item.id)
                    }>
                    <FontAwesome5
                        name="heart"
                        size={22}
                        color={item.currentUserLike ? '#e74c3c' : '#333'}
                        solid={item.currentUserLike}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                    <FontAwesome5 name="comment" size={22} color="#333" />
                </TouchableOpacity>
            </View>
            <View style={styles.cardBody}>
                {item.caption ? (
                    <Text style={styles.caption}>
                        <Text style={styles.captionUser}>{item.user.name} </Text>
                        {item.caption}
                    </Text>
                ) : null}
                <TouchableOpacity onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                    <Text style={styles.commentLink}>View comments</Text>
                </TouchableOpacity>
                <Text style={styles.timestamp}>
                    {item.creation ? moment(item.creation.toDate()).fromNow() : ''}
                </Text>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Solent Inspire</Text>
            </View>
            {posts.length === 0 ? (
                <View style={styles.empty}>
                    <FontAwesome5 name="images" size={48} color="#ccc" />
                    <Text style={styles.emptyTitle}>Nothing here yet</Text>
                    <Text style={styles.emptyText}>Follow people to see their posts</Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPost}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 16 }}
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
    headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
    card: { backgroundColor: '#fff', marginBottom: 10 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    avatar: {
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: { color: '#fff', fontWeight: '700' },
    username: { fontWeight: '700', fontSize: 14 },
    image: { width: '100%', aspectRatio: 1 },
    actions: { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 8 },
    actionBtn: { marginRight: 14, padding: 2 },
    cardBody: { paddingHorizontal: 12, paddingBottom: 12 },
    caption: { fontSize: 14, marginBottom: 4 },
    captionUser: { fontWeight: '700' },
    commentLink: { fontSize: 13, color: '#888', marginBottom: 4 },
    timestamp: { fontSize: 11, color: '#bbb' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#555', marginTop: 16 },
    emptyText: { fontSize: 14, color: '#aaa', marginTop: 6 },
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})
export default connect(mapStateToProps, null)(Feed)
