import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const KEY = '@clientes';


export default function useClientes() {
const [clientes, setClientes] = useState([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
async function carregar() {
try {
const json = await AsyncStorage.getItem(KEY);
if (json) setClientes(JSON.parse(json));
else setClientes([]);
} catch (e) { console.log('Erro clientes:', e); }
finally { setLoading(false); }
}
carregar();
}, []);


async function addCliente(novo) {
const list = [...clientes, novo];
setClientes(list);
await AsyncStorage.setItem(KEY, JSON.stringify(list));
}


return { clientes, addCliente, loading };
}