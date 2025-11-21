import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const KEY = '@servicos';


export default function useServicos() {
const [servicos, setServicos] = useState([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
async function carregar() {
try {
const json = await AsyncStorage.getItem(KEY);
if (json) setServicos(JSON.parse(json));
else setServicos([
{ label: 'Lavação completa', value: 'Lavação Completa', valor: 80 },
{ label: 'Lavagem simples', value: 'Lavagem Simples', valor: 50 },
{ label: 'Lavagem + Cera', value: 'Lavagem + Cera', valor: 100 },
]);
} catch (e) { console.log('Erro servicos:', e); }
finally { setLoading(false); }
}
carregar();
}, []);


useEffect(() => {
if (loading) return;
AsyncStorage.setItem(KEY, JSON.stringify(servicos)).catch(e => console.log('save servicos', e));
}, [servicos, loading]);


async function addServico(novo) {
const list = [...servicos, novo];
setServicos(list);
await AsyncStorage.setItem(KEY, JSON.stringify(list));
}


return { servicos, addServico, loading };
}