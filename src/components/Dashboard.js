import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { BarChart, PieChart } from 'react-native-chart-kit';

function Dashboard() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [agHoje, setAgHoje] = useState(0);
  const [agMes, setAgMes] = useState(0);

  const [saldo, setSaldo] = useState(0);
  const [servicosMaisRealizados, setServicosMaisRealizados] = useState([]);

  const [receitasDespesas, setReceitasDespesas] = useState({
    receitas: 0,
    despesas: 0,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const storageReceitas = await AsyncStorage.getItem('@tarefas');
    const storageDespesas = await AsyncStorage.getItem('@despesas');

   

    let tarefas = [];
    let despesas = [];

   

    try {
      if (storageReceitas) tarefas = JSON.parse(storageReceitas);
      if (storageDespesas) despesas = JSON.parse(storageDespesas);

      // tarefas sempre são receitas
      tarefas = tarefas.map(item => ({
        ...item,
        tipo: item.tipo || "receita"
      }));

    } catch (e) {
      console.log("ERRO AO PARSEAR JSON:", e);
    }

    // LISTA PARA O FINANCEIRO (saldo + gráfico receitas/despesas)
    const listaFinanceira = [...tarefas, ...despesas];


    // LISTA DE AGENDAMENTOS (somente tarefas)
    setAgendamentos(tarefas);

    calcularAgendamentosHoje(tarefas);
    calcularAgendamentosMes(tarefas);
    calcularServicosMaisRealizados(tarefas);

    // somente essa parte mistura tarefas + despesas
    calcularSaldo(listaFinanceira);
    calcularReceitasDespesas(listaFinanceira);
  }

  function calcularAgendamentosHoje(tarefas) {
    const hoje = new Date().toISOString().slice(0, 10);
    setAgHoje(tarefas.filter(a => a.data === hoje).length);
  }

  function calcularAgendamentosMes(tarefas) {
    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();

    const filtrados = tarefas.filter(a => {
      if (!a.data) return false;
      const mes = Number(a.data.slice(5, 7));
      const ano = Number(a.data.slice(0, 4));
      return mes === mesAtual && ano === anoAtual;
    });

    setAgMes(filtrados.length);
  }

  function calcularSaldo(lista) {
    let total = 0;

    lista.forEach(a => {
      const preco = Number(a.valor || 0);

      if (a.tipo === "despesa") total -= preco;
      if (a.tipo === "receita") total += preco;
    });

    setSaldo(total);
  }

  function calcularServicosMaisRealizados(tarefas) {
    const contador = {};

    tarefas.forEach(a => {
      if (!a.servico) return;
      contador[a.servico] = (contador[a.servico] || 0) + 1;
    });

    const array = Object.keys(contador).map(key => ({
      name: key,
      population: contador[key],
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
      legendFontColor: "#000",
      legendFontSize: 12
    }));

    setServicosMaisRealizados(array);
  }

  function calcularReceitasDespesas(lista) {
    let receitas = 0;
    let despesas = 0;

    lista.forEach(a => {
      const preco = Number(a.valor || 0);
      if (a.tipo === "despesa") despesas += preco;
      if (a.tipo === "receita") receitas += preco;
    });

    setReceitasDespesas({ receitas, despesas });
  }

  return (
    <View style={Style.Container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>


        {/* CAIXAS SUPERIORES */}
        <View style={Style.row}>
          <View style={Style.dashboardbox}>
            <Text style={Style.dashBoxText}>Agendamentos Hoje</Text>
            <Text style={Style.dashBoxNumber}>{agHoje}</Text>
          </View>

          <View style={Style.dashboardbox}>
            <Text style={Style.dashBoxText}>Agendamentos Mês</Text>
            <Text style={Style.dashBoxNumber}>{agMes}</Text>
          </View>
        </View>

        <View style={Style.row}>
          <View style={Style.dashboardbox}>
            <Text style={Style.dashBoxText}>Saldo Atual</Text>
            <Text style={Style.dashBoxNumber}>R$ {saldo}</Text>
          </View>

          <View style={Style.dashboardbox}>
            <Text style={Style.dashBoxText}>Receitas / Despesas</Text>
            <Text style={Style.dashBoxNumber}>
              R$ {receitasDespesas.receitas} / R$ {receitasDespesas.despesas}
            </Text>
          </View>
        </View>

        {/* GRÁFICO DE SERVIÇOS */}
        <Text style={Style.graficoTitulo}>Serviços mais realizados</Text>

        {servicosMaisRealizados.length > 1 ? (
          <PieChart
            data={[...servicosMaisRealizados]}
            width={Dimensions.get("window").width - 50}
            height={200}
            accessor="population"
            backgroundColor="transparent"
            chartConfig={{
              color: () => "#000",
              labelColor: () => "#000",
            }}
          />
        ) : servicosMaisRealizados.length === 1 ? (
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Apenas um serviço registrado: {servicosMaisRealizados[0].name}
          </Text>
        ) : (
          <Text style={{ textAlign: "center" }}>Nenhum serviço registrado</Text>
        )}

        {/* GRÁFICO RECEITAS x DESPESAS */}
        <Text style={Style.graficoTitulo}>Receitas x Despesas</Text>

        <BarChart
          data={{
            labels: ["Receitas", "Despesas"],
            datasets: [{ data: [receitasDespesas.receitas, receitasDespesas.despesas] }],
          }}
          width={Dimensions.get("window").width - 20}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          style={{ borderRadius: 10 }}
        />

      </ScrollView>
    </View>
  );
}

const Style = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  dashboardbox: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dashBoxText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },

  dashBoxNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },

  graficoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Dashboard;
