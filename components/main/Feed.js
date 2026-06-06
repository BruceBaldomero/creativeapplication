import React, { useState, useEffect } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import moment from 'moment'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }
        console.log(posts)

    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }
    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.containerImage}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingVertical: 4 }}>
                                <FontAwesome5 name={'user-alt'} size={12} color="#000" />
                                <Text style={{ fontWeight: 'bold', marginLeft: 5 }}>{item.user.name}</Text>
                            </View>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            {item.currentUserLike ?
                                (
                                    <TouchableOpacity
                                        style={styles.likeButton}
                                        onPress={() => onDislikePress(item.user.uid, item.id)}>
                                        <FontAwesome5 name="heart" size={20} color="#ff0000" />
                                    </TouchableOpacity>
                                )
                                :
                                (
                                    <TouchableOpacity
                                        style={styles.likeButton}
                                        onPress={() => onLikePress(item.user.uid, item.id)}>
                                        <FontAwesome5 name="heart" size={20} color="#000" />
                                    </TouchableOpacity>
                                )
                            }
                            <Text style={{ fontWeight: 'bold', paddingLeft: 5 }}>
                                {item.user.name}
                                <Text style={{ fontWeight: 'normal' }}> {item.caption}</Text>
                            </Text>
                            <Text style={{ color: '#808080', paddingLeft: 5 }}
                                onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                Add a comment...
                            </Text>
                            <Text style={{ color: '#c0c0c0', paddingLeft: 5, fontSize: 10 }}>
                                {moment(item.creation.toDate()).startOf('hour').fromNow()}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3,
        paddingVertical: 10
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    },
    likeButton: {
        paddingLeft: 5,
        paddingVertical: 4
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})
export default connect(mapStateToProps, null)(Feed);
