import React, {useState, useEffect } from 'react'
import io from 'socket.io-client'
import AsyncStorage from '@react-native-community/async-storage'
import { Text, View, SafeAreaView, Image, StyleSheet } from 'react-native'

import api from '../services/api'

import itsamatch from '../assets/itsamatch.png'
import logo from '../assets/logo.png'
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'

import { TouchableOpacity } from 'react-native-gesture-handler'



export default function Main( {navigation}) {
   //pegar o login pelo navigation
   const id = navigation.getParam('user');
   const [users, setUsers] = useState([]);//array of users
   const [matchDev, setmatchDev] = useState(null);//array of users
   
   
    //qual função e quando quero executar. E.g: Passar variaveis num array e quando essas variaveis mudarem ela executa, se array for vazio ele executa uma vez só. (Dependencias do useEffect);
    useEffect( () => {
        //load all users on db. headers: user id that logged in.
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers: { 
                    user: id
                }
            })
            setUsers(response.data)
        }
        loadUsers();
    }, [id] );

    useEffect( () => {
      const socket = io('http://10.0.2.2:8000', {
          query: { user: id }
      })

      socket.on('match', dev => {
          setmatchDev(dev)
          
      })

  }, [id]);


    async function handleLike(){
       //pegar apenas o primeiro usuario, o resto fica na outra lista
       const [user, ...restante] = users;
         await api.post(`/devs/${user._id}/likes`,null, { headers: { user: id }})
         //remove this user id from user state to update the state
         setUsers(restante);
        
    }

    async function handleDislike(){
      const [user, ...restante] = users;

        await api.post(`/devs/${user._id}/dislikes`,null, { headers: { user: id }})
        //remove this user id from user state to update the state
        setUsers(restante);

        
    }

    async function handleLogout() {
      await AsyncStorage.clear();
      navigation.navigate('Login');
      
    }
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={handleLogout}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
  
        <View style={styles.cardsContainer}>
          { users.length === 0
            ? <Text style={styles.empty}>Acabou :(</Text>
            : (
              users.map((user, index) => (
                <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                  <Image style={styles.avatar} source={{ uri: user.avatar }} />
                  <View style={styles.footer}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                  </View>
                </View>
              ))
            )}
        </View>
  
        { users.length > 0 && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleDislike}>
              <Image source={dislike} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLike}>
              <Image source={like} />
            </TouchableOpacity>
          </View>
        ) }
  
        { matchDev && (
          <View style={styles.matchContainer}>
            <Image style={styles.matchImage} source={itsamatch} />
            <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
  
            <Text style={styles.matchName}>{matchDev.name}</Text>
            <Text style={styles.matchBio}>{matchDev.bio}</Text>
  
            <TouchableOpacity onPress={() => setmatchDev(null)}>
              <Text style={styles.closeMatch}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        ) }
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
  
    logo: {
      marginTop: 30,
    },
  
    empty: {
      alignSelf: 'center',
      color: '#999',
      fontSize: 24,
      fontWeight: 'bold'
    },
  
    cardsContainer: {
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'center',
      maxHeight: 500,
    },
  
    card: {
      borderWidth: 1,
      borderColor: '#DDD',
      borderRadius: 8,
      margin: 30,
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  
    avatar: {
      flex: 1,
      height: 300,
    },
  
    footer: {
      backgroundColor: '#FFF',
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
  
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333'
    },
  
    bio: {
      fontSize: 14,
      color: '#999',
      marginTop: 5,
      lineHeight: 18
    },
  
    buttonsContainer: {
      flexDirection: 'row',
      marginBottom: 30,
    },
  
    button: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
  
    matchContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    matchImage: {
      height: 60,
      resizeMode: 'contain'
    },
  
    matchAvatar: {
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 5,
      borderColor: '#FFF',
      marginVertical: 30,
    },
  
    matchName: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#FFF'
    },
  
    matchBio: {
      marginTop: 10,
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: 24,
      textAlign: 'center',
      paddingHorizontal: 30
    },
  
    closeMatch: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginTop: 30,
      fontWeight: 'bold'
    },
  });