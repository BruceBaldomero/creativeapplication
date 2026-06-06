import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
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
                        <View
                            style={styles.containerImage}>
                            <FontAwesome5 style={{paddingLeft:5}} name={'user-alt'}> <Text style={{...styles.container, ...styles.bold}}>{item.user.name}
                            </Text>
                             </FontAwesome5>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            {item.currentUserLike ?
                                (
                                    <Icon.Button
                                        name="heart"
                                        color="#ff0000"
                                        backgroundColor="#0000"
                                        title="Dislike"
                                        onPress={() => onDislikePress(item.user.uid, item.id)} >  </Icon.Button>
                                )
                                :
                                (
                                    <Icon.Button
                                        name="heart"
                                        color="#000"
                                        backgroundColor="#0000"
                                        title="Like"
                                        onPress={() => onLikePress(item.user.uid, item.id)} >  </Icon.Button>
                                )
                            }
                            <Text style={{ fontWeight: 'bold', paddingLeft:5}}>
                                {item.user.name}
                                <Text style={{ fontWeight: 'normal' }}> {item.caption}</Text>
                            </Text>
                            <Text style={{color:'#808080', paddingLeft:5}}
                                onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                Add a comment...
                            </Text>
                            <Text style={{color:'#c0c0c0', paddingLeft:5, fontSize:10}}>
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
    bold: {
        fontWeight: 'bold'
    }
    
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);
