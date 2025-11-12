import { View, Text, StyleSheet, ScrollView } from 'react-native';

function Dashboard() {
  const TotalAgendandamentosHoje = 5;
  const AgendamentosMes = 50;
  const saldo = '5.000';

  return (

   
    <View style={Style.Container}>
     <ScrollView contentContainerStyle={{ flexGrow: 1 }} >    
      <View style={Style.row}>
        <View style={Style.dashboardbox}>
          <Text style={Style.dashBoxText}>Agendamentos hoje</Text>
          <Text style={Style.dashBoxNumber}>{TotalAgendandamentosHoje}</Text>
        </View>

        <View style={Style.dashboardbox}>
          <Text style={Style.dashBoxText}>Agendamentos Mês</Text>
          <Text style={Style.dashBoxNumber}>{AgendamentosMes}</Text>
        </View>
      </View>

      <View style={Style.row}>
        <View style={Style.dashboardbox}>
          <Text style={Style.dashBoxText}>Saldo Atual</Text>
          <Text style={Style.dashBoxNumber}>R$: {saldo}</Text>
        </View>

         <View style={Style.dashboardbox}>
          <Text style={Style.dashBoxText}>Agendamentos Mês</Text>
          <Text style={Style.dashBoxNumber}>{AgendamentosMes}</Text>
        </View>
        </View>

      </ScrollView>
    </View>
    
  );
}

const Style = StyleSheet.create({
  Container: {
    marginTop: 20,
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  dashboardbox: {
    flex: 1, // ocupa metade da linha
    height: 100, // <-- define altura fixa (todas iguais)
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginTop:5,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
  },

  dashBoxText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  dashBoxNumber: {
    fontSize: 25,
    color: 'red',
    marginTop: 10,
  },
});

export default Dashboard;
