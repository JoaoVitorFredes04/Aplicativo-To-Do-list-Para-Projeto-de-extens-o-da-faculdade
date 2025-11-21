import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, ActivityIndicator  } from 'react-native';
import Dashboard from './components/Dashboard';
import Tarefas from './components/Tarefas';
import Financas from './components/Financas';


export default function App() {
    const [telaAtual, setTelaAtual] = useState('Dashboard');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCarregando(false);
    }, 2000); // simulação de carregamento
  }, []);

  // 🔥 Enquanto estiver carregando, mostra tela de loading
  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Renderiza tela certa
  const renderTela = () => {
    if (telaAtual === 'Dashboard') return <Dashboard />;
    if (telaAtual === 'Tarefas') return <Tarefas />;
    if (telaAtual === 'Financas') return <Financas />;
  };

  const ativo = (key)=> telaAtual === key;


  return (
    
      <View style={styles.container}>
        <View style={styles.nav}>
          <Text style={styles.Title}>Organiza.AE</Text>
        </View>

        <View style={styles.Line} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setTelaAtual('Dashboard')}
            style={[styles.navButton, ativo('Dashboard') ? styles.ActivateButton : styles.inactivateButton]}>
            <Text style={[styles.navButtonText, ativo('Dashboard') && styles.TextAtivo]}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTelaAtual('Tarefas')}
            style={[styles.navButton, ativo('Tarefas') ? styles.ActivateButton : styles.inactivateButton]}>
            <Text style={[styles.navButtonText, ativo('Tarefas') && styles.TextAtivo]}>Tarefas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTelaAtual('Financas')}
            style={[styles.navButton, ativo('Financas') ? styles.ActivateButton : styles.inactivateButton]}>
            <Text style={[styles.navButtonText, ativo('Financas') && styles.TextAtivo]}>Finanças</Text>
          </TouchableOpacity>
        </View>
        
          <View style={styles.conteudo}>{renderTela()}</View>
       
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50
  },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10
  },
  Line: {
    height: 3,
    marginTop: 15,
    marginLeft: 5,
    backgroundColor: '#b4b2b2ff',
    width: '90%'
  },

  Title: { fontSize: 25, fontWeight: 'bold', fontFamily: 'monospace', marginLeft: 10 },

  buttonContainer: {
    marginTop: 15,
    backgroundColor: '#b4b2b2ff',
    marginHorizontal: 5,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    overflow: 'hidden',
  },
  conteudo: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  ActivateButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inactivateButton: {},
  navButton: {
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  navButtonText: { fontSize: 13, color: '#666', fontFamily: 'monospace' },
  TextAtivo: { color: '#000', fontWeight: 'bold' },
  logoutBtn: { alignSelf: 'flex-end', marginRight: 15, marginTop: 10 },

  menu: {
    flex:1,
    paddingTop:40,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
