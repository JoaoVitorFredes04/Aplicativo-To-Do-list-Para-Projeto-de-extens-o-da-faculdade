import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';


export default function TarefasConcluidas({ offTarefasConcluidas, restaurarTarefa, excluirTarefa, tarefas }) {
    
    function formatarDataBR(dataISO) {
    if (!dataISO) return '';
    // Espera 'YYYY-MM-DD'
    const parts = dataISO.split('-').map(Number);
    if (parts.length !== 3) return dataISO;
    const [year, month, day] = parts;
    // cria a data no fuso local (month - 1)
    const data = new Date(year, month - 1, day -7);
    return data.toLocaleDateString('pt-BR');
} 


    function formatarReais(valor) {
        if (typeof valor !== 'number') {
            valor = Number(valor) || 0;
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <Text style={styles.title}>Tarefas Concluídas</Text>
                <TouchableOpacity style={styles.buttonExit} onPress={offTarefasConcluidas}>
                    <Text style={styles.buttonExitText}>X</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={tarefas.filter(t => t.concluida)}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.servico}</Text>
                        <Text style={styles.cardTitle}>
                            {formatarReais(item.valor)}
                        </Text>
                        <Text style={styles.text}>Cliente: {item.cliente}</Text>
                        <Text style={styles.text}>Data: {formatarDataBR(item.data)}</Text>
                        <Text style={styles.text}>Descrição: {item.descricao}</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.restoreButton} onPress={() => restaurarTarefa(item.id)}>
                                <Text style={styles.btnText}>Restaurar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.deleteButton} onPress={() => excluirTarefa(item.id)}>
                                <Text style={styles.btnText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    navContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        padding: 20
    },

    buttonExit: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
    },

    buttonExitText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },

    card: {
        backgroundColor: '#ebe7e7ff',
        borderWidth: 2,
        borderColor: '#000',
        padding: 20,
        borderRadius: 8,
        marginTop: 10,
    },

    buttonRow: {
        display: 'flex',
        flexDirection: 'row'
    },

    deleteButton: {
        backgroundColor: '#ff3546ff',
        padding: 8,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
        flex: 1,
    },

    restoreButton: {
        backgroundColor: '#1e90ff',
        padding: 8,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
        flex: 1,
        marginRight: 5
    },

    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});