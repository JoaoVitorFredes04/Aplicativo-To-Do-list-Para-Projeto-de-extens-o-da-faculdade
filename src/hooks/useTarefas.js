import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const KEY = '@tarefas';


export default function useTarefas() {
const [tarefas, setTarefas] = useState([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
async function carregar() {
try {
const json = await AsyncStorage.getItem(KEY);
if (json) setTarefas(JSON.parse(json));
else setTarefas([]);
} catch (e) { console.log('Erro tarefas:', e); }
finally { setLoading(false); }
}
carregar();
}, []);


useEffect(() => {
if (loading) return;
AsyncStorage.setItem(KEY, JSON.stringify(tarefas)).catch(e => console.log('save tarefas', e));
}, [tarefas, loading]);


async function addTarefa(t) { setTarefas(prev => [...prev, t]); }
function removeTarefa(id) { setTarefas(prev => prev.filter(p => p.id !== id)); }
function duplicateTarefa(tarefa) { setTarefas(prev => [...prev, { ...tarefa, id: Date.now().toString() }]); }


return { tarefas, addTarefa, removeTarefa, duplicateTarefa, loading };
}