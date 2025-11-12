import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import Cliente from './clientes';
import AsyncStorage from '@react-native-async-storage/async-storage';



function Tarefas() {
    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, "0");
    const dd = String(hoje.getDate()).padStart(2, "0");
    const dataHoje = `${yyyy}-${mm}-${dd}`;

    const [modalVisible, setmodalVisible] = useState(false);
    const [ClientesVisible, setClientesVisible] = useState(false);

    const [Tasks, setTasks] = useState([]); // lista de tarefas

    // campos do formulário
    const [selectedDate, setSelectedDate] = useState("");
    const [Descricao, setDescricao] = useState("");
    const [Servico, setServico] = useState("");
    const [value, setValue] = useState(null);

    // dropdown config
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'joao Vitor', value: 'Joao Vitor' },
        { label: 'Sthefany', value: 'Sthefany' },
        { label: 'Gelsom', value: 'Gelsom' },
        { label: 'Lica', value: 'Lica' },
        { label: 'Mel', value: 'Mel' },
    ]);

    function ActivateModal() {
        setmodalVisible(true);
    }

    function Modalchange() {
        setClientesVisible(true);
        setmodalVisible(false);
    }

    // 👉 Função que salva a tarefa
    function salvarTarefa() {
        const novaTarefa = {
            id: Date.now().toString(),
            cliente: value || 'Sem cliente',
            servico: Servico || 'Sem serviço',
            data: selectedDate || 'Sem data',
            descricao: Descricao || 'Sem descrição'
        };

        setTasks([...Tasks, novaTarefa]);
        // limpa os campos
        setDescricao("");
        setServico("");
        setValue(null);
        setSelectedDate("");
        setmodalVisible(false);
    }

    // 💾 Salva no AsyncStorage sempre que mudar
    const [loaded, setLoaded] = useState(false);  // flag para controlar carregamento

    // Carrega as tarefas salvas
    useEffect(() => {
        const carregarTarefas = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@tarefas');
                if (jsonValue != null) {
                    setTasks(JSON.parse(jsonValue));
                }
            } catch (e) {
                console.log('Erro ao carregar tarefas', e);
            } finally {
                setLoaded(true); // sinaliza que carregou as tarefas
            }
        };

        carregarTarefas();
    }, []);

    // Salva as tarefas no AsyncStorage só depois que carregou
    useEffect(() => {
        if (!loaded) return; // se não carregou ainda, não salva

        async function salvarNoAsyncStorage() {
            try {
                await AsyncStorage.setItem('@tarefas', JSON.stringify(Tasks));
                console.log('Tarefas salvas:', Tasks.length);
            } catch (error) {
                console.log('Erro ao salvar tarefas:', error);
            }
        }

        salvarNoAsyncStorage();
    }, [Tasks, loaded]);

    function excluirTarefa(id) {
        const novasTarefas = Tasks.filter((tarefa) => tarefa.id !== id);
        setTasks(novasTarefas);
    }

    const [modalEditarVisible, setModalEditarVisible] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);

    // Campos para editar
    const [descricaoEditar, setDescricaoEditar] = useState('');
    const [servicoEditar, setServicoEditar] = useState('');
    const [dataEditar, setDataEditar] = useState('');
    const [clienteEditar, setClienteEditar] = useState(null);

    function salvarEdicao() {
        const tarefasAtualizadas = Tasks.map((tarefa) => {
            if (tarefa.id === itemSelecionado.id) {
                return {
                    ...tarefa,
                    servico: servicoEditar,
                    cliente: clienteEditar,
                    data: dataEditar,
                    descricao: descricaoEditar,
                };
            }
            return tarefa;
        });

        setTasks(tarefasAtualizadas);
        setModalEditarVisible(false);
        setItemSelecionado(null);
    }

    function abrirModalEditar(item) {
        setItemSelecionado(item);
        setDescricaoEditar(item.descricao);
        setServicoEditar(item.servico);
        setDataEditar(item.data);
        setClienteEditar(item.cliente);
        setModalEditarVisible(true);
    }

    function duplicarTarefa(tarefa) {
        const novaTarefa = {
            ...tarefa,
            id: Date.now().toString(), // id novo pra não dar conflito
        };
        setTasks([...Tasks, novaTarefa]);
    }


    return (

        <View style={Style.Container}>
            {/* Lista de tarefas */}
            <View style={Style.navContainer}>
                <Text style={Style.navText}> Agendamentos </Text>
                <TouchableOpacity style={Style.navButton} onPress={ActivateModal} >
                    <Text style={Style.navButtonText}> + Agendamento </Text>
                </TouchableOpacity>
            </View>


            <View style={Style.containerTask}>
                {Tasks.length === 0 ? (
                    <Text style={{ marginTop: 10 }}>Nenhum agendamento ainda.</Text>
                ) : (
                    <FlatList
                        data={Tasks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => abrirModalEditar(item)}>
                                <View style={Style.taskCard}>
                                    <Text style={Style.taskTitle}>{item.servico}</Text>
                                    <Text>Cliente: {item.cliente}</Text>
                                    <Text>Data: {item.data}</Text>
                                    <Text>Descrição: {item.descricao}</Text>

                                    <View style={Style.buttonTaskContainer}>
                                        <TouchableOpacity onPress={() => excluirTarefa(item.id)} style={Style.deleteButton}>
                                            <Text style={Style.deleteButtonText}>Excluir</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => duplicarTarefa(item)} style={Style.duplicateButton}>
                                            <Text style={Style.duplicateButtonText}>Duplicar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        )}
                    />

                )}
            </View>

            {/* Modal de clientes */}
            <Modal visible={ClientesVisible} animationType='slide'>
                <View style={Style.modalOverlay}>
                    <View style={Style.modalContent}>
                        <View style={Style.navModal}>
                            <Text style={Style.modalText}>Novo Cliente</Text>
                            <TouchableOpacity
                                style={Style.navModalButton}
                                onPress={() => setClientesVisible(false)}
                            >
                                <Text style={Style.NavModalButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <Cliente fecharModal={() => setClientesVisible(false)} />
                    </View>
                </View>
            </Modal>

            {/* Modal de novo agendamento */}
            <Modal visible={modalVisible} transparent={true} animationType='slide'>

                <View style={Style.modalOverlay}>

                    <View style={Style.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={Style.navModal}>
                                <Text style={Style.modalText}>Cliente</Text>
                                <TouchableOpacity
                                    style={Style.navModalButton}
                                    onPress={() => Modalchange()}
                                >
                                    <Text style={Style.NavModalButtonText}>+ Cliente</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{ zIndex: 1000 }}>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    searchable={true}
                                    searchPlaceholder="Pesquisar cliente..."
                                    style={Style.dropdown}
                                    listMode='SCROLLVIEW'
                                    dropDownContainerStyle={Style.dropDownContainer}
                                />
                            </View>

                            <View style={Style.navModal}>
                                <Text style={Style.modalText}>Serviço</Text>
                            </View>

                            <TextInput
                                placeholder='Serviço'
                                value={Servico}
                                onChangeText={setServico}
                                style={Style.modalImput}
                            />

                            <View style={Style.Calendar}>
                                <Calendar
                                    minDate={dataHoje}
                                    onDayPress={(day) => setSelectedDate(day.dateString)}
                                    markedDates={{
                                        [selectedDate]: { selected: true, selectedColor: "#ff3546ff" },
                                    }}
                                    theme={{
                                        todayTextColor: "#ff3546ff",
                                        monthTextColor: "#ff3546ff",
                                        arrowColor: "#ff3546ff",
                                    }}
                                />
                            </View>

                            <TextInput
                                placeholder="Descrição..."
                                multiline
                                numberOfLines={5}
                                value={Descricao}
                                onChangeText={setDescricao}
                                textAlignVertical="top"
                                style={Style.descStyle}
                            />

                            <View style={Style.buttonsContent}>
                                <TouchableOpacity
                                    onPress={() => setmodalVisible(false)}
                                    style={Style.button}
                                >
                                    <Text style={Style.buttonText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={Style.button}
                                    onPress={salvarTarefa}
                                >
                                    <Text style={Style.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                </View>
            </Modal>

            <Modal visible={modalEditarVisible} transparent={true} animationType="slide">
                <View style={Style.modalOverlay}>
                    <View style={Style.modalContent}>
                        <Text>Editando Tarefa</Text>

                        <Text>Serviço</Text>
                        <TextInput
                            value={servicoEditar}
                            onChangeText={setServicoEditar}
                            style={Style.modalImput}
                        />

                        <Text>Cliente</Text>
                        <TextInput
                            value={clienteEditar}
                            onChangeText={setClienteEditar}
                            style={Style.modalImput}
                        />

                        <Text>Data</Text>
                        <TextInput
                            value={dataEditar}
                            onChangeText={setDataEditar}
                            style={Style.modalImput}
                        />

                        <Text>Descrição</Text>
                        <TextInput
                            value={descricaoEditar}
                            onChangeText={setDescricaoEditar}
                            multiline
                            numberOfLines={4}
                            style={Style.descStyle}
                        />

                        <View style={Style.buttonsContent}>
                            <TouchableOpacity onPress={() => setModalEditarVisible(false)} style={Style.button}>
                                <Text style={Style.buttonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={salvarEdicao} style={Style.button}>
                                <Text style={Style.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>

    );
}

const Style = StyleSheet.create({
    Container: {
        flex: 1,
        width: '90%',
        borderRadius: 10,
        padding: 15,
        margin: 30,
        backgroundColor: '#fff',
        elevation: 5,
        borderWidth: 2,
        borderColor: '#b8b8b8ff'
    },

    navModal: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center'
    },

    NavModalButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold'
    },



    navModalButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10
    },

    modalText: {
        fontSize: 15,
        fontWeight: 'bold'
    },

    navContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
    navText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    navButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
        marginTop: 15,
        alignSelf: 'center',
    },
    navButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '85%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        elevation: 8,
    },
    modalImput: {
        borderWidth: 2,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    Calendar: {
        padding: 20,
        marginTop: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderRadius: 10,
    },
    descStyle: {
        height: 80,
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        textAlign: 'left',
    },
    dropdown: {
        backgroundColor: '#fafafa',
        borderWidth: 2,
    },
    dropDownContainer: {
        backgroundColor: '#eee',
        borderWidth: 2,
    },
    taskCard: {
        backgroundColor: '#ebe7e7ff',
        borderWidth: 2,
        borderColor: '#000',
        padding: 20,
        borderRadius: 8,
        marginTop: 10,
    },
    taskTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },

    containerTask: {
        flex: 1,
        marginTop: 10,
    },

    deleteButton: {
        backgroundColor: '#ff3546ff',
        padding: 8,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
        flex:1,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    duplicateButton: {
        backgroundColor: '#4caf50', // verde, por exemplo
        padding: 8,
        borderRadius: 8,
        marginTop: 10,
        marginLeft: 10,
        alignItems: 'center',
        flex:1,
    },
    duplicateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        
    },

    buttonTaskContainer: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
       

    },

});

export default Tarefas;
