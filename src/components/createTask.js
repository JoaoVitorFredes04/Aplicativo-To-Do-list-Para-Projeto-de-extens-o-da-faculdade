import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList } from 'react-native';
 import { Calendar } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
 

 function CreateTask() {
const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Maçã', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Laranja', value: 'orange' },
        { label: 'Manga', value: 'mango' },
        { label: 'Uva', value: 'grape' },
    ]);

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
    

        return (
           
                <View style={Style.modalContent}>

                    <View style={Style.navModal}>
                        <Text style={Style.modalText}>Cliente</Text>
                        <TouchableOpacity
                            style={Style.navButton}
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

                </View>

        )
    };

    const Style = StyleSheet.create({
    Container: {
        flex: 1,
        width: '90%',
        borderRadius: 10,
        padding: 15,
        margin: 30,
        backgroundColor: '#fff',
        elevation: 5,
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
        marginTop: 10,
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
        zIndex: 9999,
    },
    taskCard: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
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
});

    export default CreateTask;