import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { KeyboardAvoidingView,View, Platform, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'

import logo from '../assets/logo.png';
import api from '../services/api';

/* @useEffect
Para dispararar funçõess assim que o componente é exibido na tela
1o param: função
2o param: quando? Quando essas variaveis mudarem
Nesse caso qnd o comp for exebidio na tela, 2o param vazio. uma unica vez
 */

export default function Login( { navigation } ) {
    const [user, setUser ] = useState('')
    useEffect( () => {
        AsyncStorage.getItem('user').then(user => {
            if(user){
                navigation.navigate('Main', { user  });
            }
        })
    }, [])


    //usuario loga, armazena no estado. Qnd abre o app denovo ele chama useffect
    async function handleLogin(){
        
       const response = await api.post('/devs', { username: user })
       const { _id } = response.data;

       await AsyncStorage.setItem('user', _id);

        navigation.navigate('Main', { user: _id });
    }

    return (
        <KeyboardAvoidingView 
        behavior="padding"
        enabled={Platform.OS === 'ios'}
        style={ styles.container }
        >
            <Image source={ logo }></Image>
            <TextInput
             value={user}
             onChangeText={setUser}
             autoCapitalize="none"
             autoCorrect={false}
             placeholder="Insert your github user"
             placeholderTextColor="#999" 
             style= {styles.input}/>
             <TouchableOpacity style={styles.button} onPress={handleLogin}>
                 <Text style={styles.buttonText}>Login </Text>
             </TouchableOpacity>
        </KeyboardAvoidingView>

    ) 
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30

    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'

    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    }
})