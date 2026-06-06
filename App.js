import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';

import { View, Text } from 'react-native'

import firebase from 'firebase'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))



const firebaseConfig = {
  apiKey: "AIzaSyCNwvtSg5q7qn84iTghreJ4vRKm83yzslg",
  authDomain: "creativeapp-development.firebaseapp.com",
  projectId: "creativeapp-development",
  storageBucket: "creativeapp-development.appspot.com",
  messagingSenderId: "1097013295918",
  appId: "1:1097013295918:web:15d19bc507d965cde558bf",
  measurementId: "G-GGJFKSCZ1H"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import UploadScreen from './components/main/Upload'
import UploadbutScreen from './components/main/Uploadbut'
import CommentScreen from './components/main/Comment'


const Stack = createStackNavigator();


export class App extends Component {
  constructor(props) {
    super()
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerTitleAlign: 'center'}}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerTitleAlign: 'center'}}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer >
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="SOLENT INSPIRE" component={MainScreen} options={{headerTitleAlign: 'center'}}/>
            <Stack.Screen name="Upload" component={UploadScreen} options={{headerTitleAlign: 'center', title:'UPLOAD'}}/>
            <Stack.Screen name="Uploadbut" component={UploadbutScreen} options={{headerTitleAlign: 'center', title:'Upload'}}/>
            <Stack.Screen name="Comment" component={CommentScreen} options={{headerTitleAlign: 'center'}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App
