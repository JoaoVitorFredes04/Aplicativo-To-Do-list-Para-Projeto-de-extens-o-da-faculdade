import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import Feather from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get("window").width;

export default function Financas() {

  const [despesas, setDespesas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  // ================================
  // CARREGAR DESPESAS + RECEITAS DO TAREFAS
  // ================================
  useEffect(() => {
    async function carregarDados() {
      const d = await AsyncStorage.getItem('@despesas');  // despesas + receitas vindas da outra tela
      const despesasLista = d ? JSON.parse(d) : [];

      setDespesas(despesasLista);
    }
    carregarDados();
  }, []);

  const salvarLista = async (novaLista) => {
    await AsyncStorage.setItem('@despesas', JSON.stringify(novaLista));
    setDespesas(novaLista);
  };

  // ================================
  // ADICIONAR DESPESA MANUAL
  // ================================
  const adicionarDespesa = async () => {
    if (!descricao || !valor) return alert("Preencha todos os campos!");

    const nova = {
      id: Date.now().toString(),
      descricao,
      valor: Number(valor),
      data: new Date().toISOString().split("T")[0],
      tipo: "despesa"
    };

    const listaAtualizada = [...despesas, nova];
    await salvarLista(listaAtualizada);

    setDescricao("");
    setValor("");
  };

  // ================================
  // EXCLUIR
  // ================================
  const apagarItem = async (id) => {
    const novaLista = despesas.filter(item => item.id !== id);
    await salvarLista(novaLista);
  };

  // ================================
  // AGRUPAMENTO PARA O GRÁFICO
  // ================================
  function agruparValores() {
    const resumo = {};

    despesas.forEach(item => {
      if (!item.data) return;

      const [ano, mes, dia] = item.data.split("-");
      const dataBR = `${dia}/${mes}/${ano}`;

      if (!resumo[dataBR]) resumo[dataBR] = { receitas: 0, despesas: 0 };

      if (item.tipo === "despesa") resumo[dataBR].despesas += Number(item.valor);
      else resumo[dataBR].receitas += Number(item.valor);
    });

    return Object.entries(resumo).map(([data, valores]) => ({
      data,
      receitas: valores.receitas,
      despesas: valores.despesas
    }));
  }

  const dados = agruparValores();

  // ================================
  // LANÇAMENTOS DO DIA
  // ================================
  const hoje = new Date().toISOString().split("T")[0];

  const lancamentosDoDia = despesas.filter(item => item.data === hoje);

  // ================================
  // LANÇAMENTOS DO MÊS
  // ================================
  const dataAtual = new Date();
  const anoAtual = String(dataAtual.getFullYear());
  const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, "0");

  const lancamentosDoMes = despesas.filter(item => {
    if (!item.data) return false;

    const [ano, mes] = item.data.split("-");
    return ano === anoAtual && mes === mesAtual;
  });

  const totalMes = lancamentosDoMes.reduce((acc, item) => {
    if (item.tipo === "receita") acc.receitas += Number(item.valor);
    else acc.despesas += Number(item.valor);
    return acc;
  }, { receitas: 0, despesas: 0 });

  // ================================
  // RENDER
  // ================================
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Finanças</Text>

      {/* ADICIONAR DESPESA */}
      <Text style={{ fontSize: 18, marginTop: 10 }}>Adicionar Despesa</Text>

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={{
          borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10
        }}
      />

      <TextInput
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        style={{
          borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10
        }}
      />

      <TouchableOpacity
        onPress={adicionarDespesa}
        style={{
          backgroundColor: "#ff3546",
          padding: 12,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Adicionar</Text>
      </TouchableOpacity>

      {/* ================================
          GRÁFICO
      =================================*/}
      {dados.length > 0 && (
        <LineChart
          data={{
            labels: dados.map(i => i.data),
            datasets: [
              { data: dados.map(i => i.receitas), color: () => "#009900" },
              { data: dados.map(i => i.despesas), color: () => "#ff0000" }
            ],
            legend: ["Receitas", "Despesas"]
          }}
          width={screenWidth - 40}
          height={250}
          yAxisLabel="R$ "
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          style={{ borderRadius: 16, marginBottom: 25 }}
        />
      )}

      {/* ================================
          LANÇAMENTOS DO DIA
      =================================*/}
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Lançamentos do Dia</Text>

      {lancamentosDoDia.length === 0 && (
        <Text style={{ opacity: 0.5, marginTop: 5 }}>Nenhum lançamento hoje.</Text>
      )}

      {lancamentosDoDia.map(item => (
        <View
          key={item.id}
          style={{
            padding: 10,
            backgroundColor: "#eee",
            borderRadius: 10,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>{item.descricao}</Text>
            <Text>Valor: R$ {item.valor}</Text>

            <Text style={{
              color: item.tipo === "receita" ? "green" : "red",
              fontWeight: "bold"
            }}>
              {item.tipo === "receita" ? "Receita" : "Despesa"}
            </Text>

            <Text style={{ opacity: 0.6 }}>{item.data.split("-").reverse().join("/")}</Text>
          </View>

          <TouchableOpacity onPress={() => apagarItem(item.id)}>
            <Feather name="trash-2" size={26} color="#ff0000" />
          </TouchableOpacity>
        </View>
      ))}

      {/* ================================
          LANÇAMENTOS DO MÊS
      =================================*/}
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 25 }}>
        Lançamentos do Mês
      </Text>

      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 16 }}>
          Total de Receitas: <Text style={{ color: "green" }}>R$ {totalMes.receitas.toFixed(2)}</Text>
        </Text>
        <Text style={{ fontSize: 16 }}>
          Total de Despesas: <Text style={{ color: "red" }}>R$ {totalMes.despesas.toFixed(2)}</Text>
        </Text>
      </View>

      {lancamentosDoMes.map(item => (
        <View
          key={item.id}
          style={{
            padding: 10,
            backgroundColor: "#eee",
            borderRadius: 10,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>{item.descricao}</Text>
            <Text>Valor: R$ {item.valor}</Text>

            <Text style={{
              color: item.tipo === "receita" ? "green" : "red",
              fontWeight: "bold"
            }}>
              {item.tipo === "receita" ? "Receita" : "Despesa"}
            </Text>

            <Text style={{ opacity: 0.6 }}>{item.data.split("-").reverse().join("/")}</Text>
          </View>

          <TouchableOpacity onPress={() => apagarItem(item.id)}>
            <Feather name="trash-2" size={26} color="#ff0000" />
          </TouchableOpacity>
        </View>
      ))}

    </ScrollView>
  );
}
