import React, { useState, useEffect } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

const Avatar = ({ name, size = 36 }) => {
    const initials = name ? name.slice(0, 2).toUpperCase() : '?'
    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
        </View>
    )
}

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState('')
    const [text, setText] = useState('')

    useEffect(() => {
        function matchUserToComment(list) {
            const updated = list.map(c => {
                if (c.user) return c
                const user = props.users.find(x => x.uid === c.creator)
                if (user == undefined) {
                    props.fetchUsersData(c.creator, false)
                    return c
                }
                return { ...c, user }
            })
            setComments(updated)
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    matchUserToComment(fetched)
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        if (!text.trim()) return
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text: text.trim()
            })
        setText('')
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {comments.length === 0 ? (
                <View style={styles.empty}>
                    <FontAwesome5 name="comment-dots" size={40} color="#ddd" />
                    <Text style={styles.emptyTitle}>No comments yet</Text>
                    <Text style={styles.emptySubText}>Be the first to comment</Text>
                </View>
            ) : (
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 12 }}
                    renderItem={({ item }) => (
                        <View style={styles.commentRow}>
                            <Avatar name={item.user?.name} />
                            <View style={styles.commentContent}>
                                {item.user ? <Text style={styles.commentUser}>{item.user.name}</Text> : null}
                                <Text style={styles.commentText}>{item.text}</Text>
                            </View>
                        </View>
                    )}
                />
            )}
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor="#aaa"
                    value={text}
                    onChangeText={setText}
                    multiline
                />
                <TouchableOpacity style={styles.sendBtn} onPress={onCommentSend}>
                    <FontAwesome5 name="paper-plane" size={16} color="#fff" solid />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    avatar: {
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: { color: '#fff', fontWeight: '700' },
    commentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
    },
    commentContent: { flex: 1 },
    commentUser: { fontWeight: '700', fontSize: 13, marginBottom: 2 },
    commentText: { fontSize: 14, color: '#333' },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#fafafa',
        maxHeight: 80,
        marginRight: 10,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: '#555', marginTop: 14 },
    emptySubText: { fontSize: 14, color: '#aaa', marginTop: 6 },
})

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment)
