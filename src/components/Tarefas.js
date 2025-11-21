
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, ScrollView, Pressable, Keyboard } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import TarefasConcluidas from './tarefasConcluidas';
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
    const [valueCliente, setValueCliente] = useState(null);

    // dropdown config
    const [openCliente, setOpenCliente] = useState(false);
    const [itemsCliente, setItemsCliente] = useState([
        { label: 'joao Vitor', value: 'Joao Vitor' }
    ]);


    const [valueServico, setValueServico] = useState(null);
    const [openServico, setOpenServico] = useState(false);

    function ActivateModal() {
        setmodalVisible(true);
    }

    function Modalchange() {
        setClientesVisible(true);
        setmodalVisible(false);
    }

    function formatarDataBR(dataISO) {
    if (!dataISO) return '';
    // Espera 'YYYY-MM-DD'
    const parts = dataISO.split('-').map(Number);
    if (parts.length !== 3) return dataISO;
    const [year, month, day] = parts;
    // cria a data no fuso local (month - 1)
    const data = new Date(year, month - 1, day);
    return data.toLocaleDateString('pt-BR');
} 

    function formatarReais(valor) {
        if (typeof valor !== 'number') {
            valor = Number(valor) || 0;
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // 👉 Função que salva a tarefa
    function salvarTarefa() {
        const servicoSelecionado = itemServico.find(item => item.value === valueServico);
        const valorServicoSelecionado = servicoSelecionado ? servicoSelecionado.valor : 0;
        const novaTarefa = {
            id: Date.now().toString(),
            cliente: valueCliente || 'Sem cliente',
            servico: valueServico || 'Sem serviço',
            valor: valorServicoSelecionado,
            data: selectedDate || 'Sem data',
            descricao: Descricao || 'Sem descrição',
            concluida: false,
            tipo: "receita",
        };

        function concluirTarefa(id) {
            const tarefasAtualizadas = Tasks.map((t) => {
                if (t.id === id) {
                    return { ...t, concluida: true };
                }
                return t;
            });

            setTasks(tarefasAtualizadas);
        }

        setTasks([...Tasks, novaTarefa]);
        // limpa os campos
        setDescricao("");
        setValueServico(null);
        setValueCliente(null);
        setSelectedDate("");
        setmodalVisible(false);
    }

  async function toggleConcluida(id) {
    const tarefasAtualizadas = Tasks.map((t) => {
        if (t.id === id) {
            // Se estiver concluindo agora, manda pro Finanças
            if (!t.concluida) {
                adicionarReceitaFinancas(t);
            }
            return { ...t, concluida: !t.concluida };
        }
        return t;
    });

    setTasks(tarefasAtualizadas);
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
                    servico: valueServicoEditar,
                    cliente: valueClienteEditar,
                    data: dataEditar,
                    descricao: descricaoEditar,
                };
            }
            return tarefa;
        })

        setTasks(tarefasAtualizadas);
        setModalEditarVisible(false);
        setItemSelecionado(null);
    }

    function abrirModalEditar(item) {
        setItemSelecionado(item);
        setDescricaoEditar(item.descricao);
        setDataEditar(item.data);
        setValueClienteEditar(item.cliente);
        setValueServicoEditar(item.servico);

        setModalEditarVisible(true);
    }

    function duplicarTarefa(tarefa) {
        const novaTarefa = {
            ...tarefa,
            id: Date.now().toString(), // id novo pra não dar conflito
        };
        setTasks([...Tasks, novaTarefa]);
    }

    //serviços

    const [modalServicoVisible, setModalServicoVisible] = useState(false);

    // campos novo serviço
    const [novoServicoNome, setNovoServicoNome] = useState("");
    const [novoServicoValor, setNovoServicoValor] = useState("");

    // lista de serviços guardados
    const [itemServico, setitemServico] = useState([]);

    useEffect(() => {
        async function carregarServicos() {
            try {
                const jsonValue = await AsyncStorage.getItem('@servicos');
                if (jsonValue != null) {
                    setitemServico(JSON.parse(jsonValue));
                } else {
                    setitemServico([
                        { label: 'Lavação completa', value: 'Lavação Completa', valor: 80 },
                        { label: 'Lavagem simples', value: 'Lavagem Simples', valor: 50 },
                        { label: 'Lavagem + Cera', value: 'Lavagem + Cera', valor: 100 },
                    ]);
                }
            } catch (e) {
                console.log("Erro ao carregar serviços:", e);
            }
        }

        carregarServicos();
    }, []);

    async function salvarNovoServico() {
        if (!novoServicoNome || !novoServicoValor) {
            alert("Preencha nome e valor!");
            return;
        }

        const novoServico = {
            label: novoServicoNome,
            value: novoServicoNome,
            valor: Number(novoServicoValor)
        };

        const listaAtualizada = [...itemServico, novoServico];

        setitemServico(listaAtualizada);
        await AsyncStorage.setItem('@servicos', JSON.stringify(listaAtualizada));

        setNovoServicoNome("");
        setNovoServicoValor("");
        setModalServicoVisible(false);
        setmodalVisible(true); // volta para o modal principal
    }

    const [valueClienteEditar, setValueClienteEditar] = useState(null);
    const [openClienteEditar, setOpenClienteEditar] = useState(false);

    const [valueServicoEditar, setValueServicoEditar] = useState(null);
    const [openServicoEditar, setOpenServicoEditar] = useState(false);

    const [telaTarefasConcluidas, settelaTarefasConcluidas] = useState(false);
    const tarefasPendentes = Tasks.filter(tarefa => !tarefa.concluida);

    function OnTarefasConcluidas() {
        settelaTarefasConcluidas(true)
    }

    function offTarefasConcluidas() {
        settelaTarefasConcluidas(false)
    }


    function restaurarTarefa(id) {
        const novas = Tasks.map(t =>
            t.id === id ? { ...t, concluida: false } : t
        );
        setTasks(novas);
    }

    const [modalClienteVisible, setModalClienteVisible] = useState(false)
    const [novoClienteNome, setNovoClienteNome] = useState("");
    const [listaClientes, setListaClientes] = useState([]);

    async function salvarNovoCliente() {
        if (!novoClienteNome.trim()) {
            alert("Digite o nome do cliente!");
            return;
        }

        const novoCliente = {
            label: novoClienteNome,
            value: novoClienteNome
        };

        const listaAtualizada = [...itemsCliente, novoCliente];
        setItemsCliente(listaAtualizada);


        await AsyncStorage.setItem('@clientes', JSON.stringify(listaAtualizada));

        setNovoClienteNome("");
        setModalClienteVisible(false);
        setmodalVisible(true);
    }

    useEffect(() => {
        async function carregarClientes() {
            try {
                const json = await AsyncStorage.getItem('@clientes');
                if (json != null) {
                    setItemsCliente(JSON.parse(json));
                }
            } catch (e) {
                console.log("Erro ao carregar clientes:", e);
            }
        }

        carregarClientes();
    }, []);

    async function excluirCliente(cliente) {
        const novaLista = itemsCliente.filter(c => c.value !== cliente.value);

        setItemsCliente(novaLista);

        await AsyncStorage.setItem('@clientes', JSON.stringify(novaLista));
    }

     async function excluirServico(Servico) {
        const novaListaServico = itemServico.filter(c => c.value !== Servico.value);

        setitemServico(novaListaServico);

        await AsyncStorage.setItem('@servicos', JSON.stringify(novaListaServico));
    }

    async function adicionarReceitaFinancas(tarefa) {
    try {
        const json = await AsyncStorage.getItem('@despesas');
        const lista = json ? JSON.parse(json) : [];

        const novaEntrada = {
            id: Date.now().toString(),
            descricao: tarefa.servico + " - " + tarefa.cliente,
            valor: Number(tarefa.valor),
            data: tarefa.data,
            tipo: "receita"
        };

        await AsyncStorage.setItem('@despesas', JSON.stringify([...lista, novaEntrada]));

        console.log("Receita enviada para Finanças!");
    } catch (e) {
        console.log("Erro ao enviar receita:", e);
    }
}





    return (

        <View style={Style.Container}>
            {/* Lista de tarefas */}
            <View style={Style.navContainer}>
                <Text style={Style.navText}> Agendamentos </Text>
                <TouchableOpacity style={[Style.navButton, { marginRight: 8 }]} onPress={ActivateModal}>
                    <Text style={Style.navButtonText}>+ Agendamento</Text>
                </TouchableOpacity>
            </View>


            <View style={Style.containerTask}>
                {tarefasPendentes.length === 0 ? (
                    <Text style={{ marginTop: 10, textAlign: 'center' }}>Ainda não tem agendamento.</Text>
                ) : (
                    <FlatList
                        data={Tasks.filter(t => !t.concluida)}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => abrirModalEditar(item)}>
                                <View style={[
                                    Style.taskCard,
                                    item.concluida && { opacity: 0.5, borderColor: 'green' }
                                ]}>

                                    <Text style={Style.taskTitle}>{item.servico}</Text>
                                    <Text style={Style.taskTitle}>
                                        {formatarReais(item.valor)}
                                    </Text>
                                    <Text>Cliente: {item.cliente}</Text>
                                    <Text>Data: {formatarDataBR(item.data)}</Text>
                                    <Text>Descrição: {item.descricao}</Text>

                                    <View style={Style.buttonTaskContainer}>
                                        <TouchableOpacity onPress={() => excluirTarefa(item.id)} style={Style.deleteButton}>
                                            <Text style={Style.deleteButtonText}>Excluir</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => duplicarTarefa(item)} style={Style.duplicateButton}>
                                            <Text style={Style.duplicateButtonText}>Duplicar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => toggleConcluida(item.id)}
                                            style={{
                                                backgroundColor: item.concluida ? '#777' : '#1e90ff',
                                                padding: 8,
                                                borderRadius: 8,
                                                marginTop: 10,
                                                marginLeft: 10,
                                                alignItems: 'center',
                                                flex: 1,
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                                {item.concluida ? 'Concluída' : 'Concluir'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        )}
                    />

                )}
            </View>




            {/* Modal de novo agendamento */}
            <Modal visible={modalVisible} transparent={true} animationType='slide'>

                <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>

                    <View style={Style.modalOverlay}>

                        <View style={Style.modalContent}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={Style.navModal}>
                                    <Text style={Style.modalText}>Cliente</Text>
                                    <TouchableOpacity
                                        style={Style.navModalButton}
                                        onPress={() => {
                                            setModalClienteVisible(true);
                                        }}
                                    >
                                        <Text style={Style.NavModalButtonText}>+ Cliente</Text>
                                    </TouchableOpacity>

                                </View>

                                <View style={{ zIndex: 1000 }}>
                                    <DropDownPicker
                                        open={openCliente}
                                        value={valueCliente}
                                        items={itemsCliente}
                                        setOpen={setOpenCliente}
                                        setValue={setValueCliente}
                                        setItems={setItemsCliente}
                                        searchable={true}
                                        placeholder='clientes'
                                        searchPlaceholder="Pesquisar cliente..."
                                        style={Style.dropdown}
                                        listMode='SCROLLVIEW'
                                        dropDownContainerStyle={Style.dropDownContainer}
                                    />
                                </View>

                                <View style={Style.navModal}>
                                    <Text style={Style.modalText}>Serviço</Text>
                                    <TouchableOpacity
                                        style={Style.navModalButton}
                                        onPress={() => {
                                            setModalServicoVisible(true);
                                        }}
                                    >
                                        <Text style={Style.NavModalButtonText}>+ Serviço</Text>
                                    </TouchableOpacity>

                                </View>

                                <View style={{ zIndex: 900 }}>
                                    <DropDownPicker

                                        open={openServico}
                                        value={valueServico}
                                        items={itemServico}
                                        setOpen={setOpenServico}
                                        setValue={setValueServico}
                                        setItems={setitemServico}
                                        searchable={true}
                                        listMode='SCROLLVIEW'
                                        placeholder='serviços'
                                        style={Style.dropdown}
                                        dropDownContainerStyle={Style.dropDownContainer}

                                    >

                                    </DropDownPicker>
                                </View>

                                <Modal visible={modalServicoVisible} transparent={true} animationType='slide'>
                                    <View style={Style.modalOverlay}>
                                        <View style={Style.modalContent}>

                                            <View style={Style.navModal}>
                                                <Text style={Style.modalText}>Novo Serviço</Text>
                                                <TouchableOpacity
                                                    style={Style.navModalButton}
                                                    onPress={() => {
                                                        setModalServicoVisible(false);
                                                        setmodalVisible(true);
                                                    }}
                                                >
                                                    <Text style={Style.NavModalButtonText}>X</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <Text>Nome do Serviço</Text>
                                            <TextInput
                                                placeholder="Ex: Lavação completa"
                                                style={Style.modalImput}
                                                value={novoServicoNome}
                                                onChangeText={setNovoServicoNome}
                                            />

                                            <Text>Valor (R$)</Text>
                                            <TextInput
                                                placeholder="Ex: 80"
                                                style={Style.modalImput}
                                                keyboardType="numeric"
                                                value={novoServicoValor}
                                                onChangeText={setNovoServicoValor}
                                            />

                                             <FlatList
                                                data={itemServico}
                                                keyExtractor={(item) => item.value}
                                                renderItem={({ item }) => (
                                                    <View style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        padding: 10,
                                                        borderBottomWidth: 1
                                                    }}>
                                                        <Text>{item.label}</Text>

                                                        <TouchableOpacity onPress={() => excluirServico(item)}>
                                                            <Text style={{ color: "red" }}>Excluir</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            />

                                            <View style={Style.buttonsContent}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setModalServicoVisible(false);
                                                    }}
                                                    style={Style.button}
                                                >
                                                    <Text style={Style.buttonText}>Cancelar</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={Style.button} onPress={salvarNovoServico}>
                                                    <Text style={Style.buttonText}>Salvar</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </View>

                                </Modal>



                                <Modal visible={modalClienteVisible} transparent={true} animationType='slide'>
                                    <View style={Style.modalOverlay}>
                                        <View style={Style.modalContent}>

                                            <View style={Style.navModal}>
                                                <Text style={Style.modalText}>Novo cliente</Text>
                                                <TouchableOpacity
                                                    style={Style.navModalButton}
                                                    onPress={() => {
                                                        setModalClienteVisible(false);
                                                        setmodalVisible(true);
                                                    }}
                                                >
                                                    <Text style={Style.NavModalButtonText}>X</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <Text>Nome do Cliente</Text>
                                            <TextInput
                                                placeholder="Ex: Joao"
                                                style={Style.modalImput}
                                                value={novoClienteNome}
                                                onChangeText={setNovoClienteNome}
                                            />

                                            <FlatList
                                                data={itemsCliente}
                                                keyExtractor={(item) => item.value}
                                                renderItem={({ item }) => (
                                                    <View style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        padding: 10,
                                                        borderBottomWidth: 1
                                                    }}>
                                                        <Text>{item.label}</Text>

                                                        <TouchableOpacity onPress={() => excluirCliente(item)}>
                                                            <Text style={{ color: "red" }}>Excluir</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            />



                                            <View style={Style.buttonsContent}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setModalServicoVisible(false);
                                                    }}
                                                    style={Style.button}
                                                >
                                                    <Text style={Style.buttonText}>Cancelar</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={Style.button} onPress={salvarNovoCliente}>
                                                    <Text style={Style.buttonText}>Salvar</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </View>

                                </Modal>


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
                </Pressable>
            </Modal>

            <Modal visible={modalEditarVisible} transparent={true} animationType="slide" style={{ zIndex: 100, }}>
                <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                    <View style={Style.editar} >
                        <View style={Style.modalOverlay}>

                            <View style={Style.modalEditarContent}>
                                <ScrollView>
                                    <Text style={Style.navText}>Editar Tarefa</Text>

                                    <Text style={Style.editarTask}>Serviço</Text>
                                    <View style={{ zIndex: 900 }}>
                                        <DropDownPicker

                                            open={openServicoEditar}
                                            value={valueServicoEditar}
                                            items={itemServico}
                                            setOpen={setOpenServicoEditar}
                                            setValue={setValueServicoEditar}
                                            setItems={setitemServico}
                                            searchable={true}
                                            listMode='SCROLLVIEW'
                                            placeholder='serviços'
                                            style={Style.dropdown}
                                            dropDownContainerStyle={Style.dropDownContainer}

                                        >

                                        </DropDownPicker>
                                    </View>

                                    <Text style={Style.editarTask}>Cliente</Text>
                                    <View style={{ zIndex: 800 }}>
                                        <DropDownPicker
                                            open={openClienteEditar}
                                            value={valueClienteEditar}
                                            items={itemsCliente}
                                            setOpen={setOpenClienteEditar}
                                            setValue={setValueClienteEditar}
                                            setItems={setItemsCliente}
                                            searchable={true}
                                            placeholder='clientes'
                                            searchPlaceholder="Pesquisar cliente..."
                                            style={Style.dropdown}
                                            listMode='SCROLLVIEW'
                                            dropDownDirection='BOTTOM'
                                            dropDownContainerStyle={Style.dropDownContainer}
                                        />
                                    </View>

                                    <Text style={Style.editarTask}>Data</Text>
                                    <TextInput
                                        value={formatarDataBR(dataEditar)}
                                        onChangeText={setDataEditar}
                                        style={Style.modalImput}
                                    />

                                    <Text style={Style.editarTask}>Descrição</Text>
                                    <TextInput
                                        value={descricaoEditar}
                                        onChangeText={setDescricaoEditar}
                                        multiline
                                        numberOfLines={4}

                                        style={Style.descStyle}
                                    />


                                    <View style={Style.buttonsContent} >
                                        <TouchableOpacity onPress={salvarEdicao} style={Style.button}>
                                            <Text style={Style.buttonText}>Salvar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={Style.button} onPress={() => setModalEditarVisible(false)}>
                                            <Text style={Style.buttonText} >Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>

                                </ScrollView>
                            </View>

                        </View >
                    </View>
                </Pressable>
            </Modal >

            <View>
                <TouchableOpacity style={Style.ButtonConcluido} onPress={OnTarefasConcluidas}>
                    <Text style={Style.navButtonText}>concluidas</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={telaTarefasConcluidas}>
                <TarefasConcluidas
                    offTarefasConcluidas={() => settelaTarefasConcluidas(false)}
                    restaurarTarefa={restaurarTarefa}
                    excluirTarefa={excluirTarefa}
                    tarefas={Tasks} />
            </Modal>
        </View >

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

    navContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        marginTop: 15,
    },

    navText: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    navButton: {
        backgroundColor: '#000',
        padding: 8,
        borderRadius: 10,
        marginTop: 15,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },

    ButtonConcluido: {
        backgroundColor: '#00ff00',
        padding: 8,
        borderRadius: 10,
        marginTop: 15,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    navButtonText: {
        color: '#fff',
        fontSize: 14,
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
        flex: 1,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    duplicateButton: {
        backgroundColor: '#4caf50',
        padding: 8,
        borderRadius: 8,
        marginTop: 10,
        marginLeft: 10,
        alignItems: 'center',
        flex: 1,
    },
    duplicateButtonText: {
        color: '#fff',
        fontWeight: 'bold',

    },



    buttonTaskContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',


    },

    editar: {
        flex: 1,
    },

    modalEditarContent: {
        width: '100%',
        height: '40%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        padding: 20,
    },

    buttoncancel: {
        marginRight: 30,
        alignItems: 'flex-end'
    },

    editarTask: {
        margin: 10,
        fontWeight: 'bold',
        fontSize: 15
    }

});

export default Tarefas;
