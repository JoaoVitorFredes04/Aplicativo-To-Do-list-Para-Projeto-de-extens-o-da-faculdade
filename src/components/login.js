import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import app from './firebaseConfig';  // Ajuste o caminho conforme seu projeto
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const auth = getAuth(app);

  const handleLogin = async () => {
    try {
      // Tenta logar com email (usuario) e senha no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, usuario, senha);
      const user = userCredential.user;

      // Salva status no AsyncStorage
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // Chama callback para informar que logou
      onLogin();

    } catch (error) {
      // Mostra erro
      Alert.alert('Erro', 'Usuário ou senha incorretos!');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organiza.AE</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={usuario}
        onChangeText={setUsuario}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 12,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
