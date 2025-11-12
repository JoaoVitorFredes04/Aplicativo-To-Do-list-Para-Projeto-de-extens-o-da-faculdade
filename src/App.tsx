import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal } from 'react-native';
import Dashboard from './components/Dashboard';
import Tarefas from './components/Tarefas';
import Financas from './components/Financas';
import Menu from './components/menu';


export default function App() {
  const [telaAtual, setTelaAtual] = useState('Dashboard');
  const [telaMenu, settelaMenu] = useState(false)

  function menuActivate() {
    settelaMenu(true)
  }

  function menuDesactivate() {
    settelaMenu(false)
  }


  const renderTela = () => {
    if (telaAtual === 'Dashboard') return <Dashboard />;
    if (telaAtual === 'Tarefas') return <Tarefas />;
    if (telaAtual === 'Financas') return <Financas />;
  };

  const ativo = (key: string) => telaAtual === key;

  return (
    
      <View style={styles.container}>
        <View style={styles.nav}>
          <Text style={styles.Title}>Organiza.AE</Text>
          <TouchableOpacity onPress={menuActivate}>
            <Text>Menu</Text>
          </TouchableOpacity>
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
       

        <Modal visible={telaMenu} animationType='slide' style={styles.menu}>
          <View style={styles.menu}>

          <TouchableOpacity onPress={menuDesactivate} style={{ alignItems: 'flex-end', margin: 15 }}>
            <Text style={{ textAlign: 'left' }}>voltar</Text>
          </TouchableOpacity>
          <Menu />
        </View>
        </Modal>
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
    paddingTop:40,
  }
});
