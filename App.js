// Importa os componentes e hooks necessários do React e React Native.
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  Button,
} from 'react-native';
// Importa o AsyncStorage para armazenamento local de dados.
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importa os estilos definidos no arquivo style.js.
import { styles } from './style.js';
// Importa a biblioteca de ícones Feather para usar ícones no app.
import { Feather } from '@expo/vector-icons';

// Define o componente principal do aplicativo.
export default function App() {
  // --- DEFINIÇÃO DOS ESTADOS (useState) ---
  // A função useState cria "variáveis de estado", que, quando alteradas, fazem a tela ser redesenhada.

  // Armazena a lista de todos os usuários. Inicia como um array vazio.
  const [users, setUsers] = useState([]);

  // Controla a visibilidade do modal (pop-up) de criação/edição de usuário.
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  // Armazena o valor do campo de nome no formulário.
  const [nome, setNome] = useState('');
  // Armazena o valor do campo de email no formulário.
  const [email, setEmail] = useState('');
  // Armazena o valor do campo de telefone no formulário.
  const [telefone, setTelefone] = useState('');
  // Armazena o valor do campo de senha no formulário de criação.
  const [password, setPassword] = useState('');
  // Armazena o valor do campo de confirmação de senha no formulário de criação.
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Controla a visibilidade do modal de alteração de senha.
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  // Armazena o valor do campo de senha antiga.
  const [oldPassword, setOldPassword] = useState('');
  // Armazena o valor do campo de nova senha.
  const [newPassword, setNewPassword] = useState('');
  // Armazena o valor do campo de confirmação de nova senha.
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  // Armazena mensagens de erro relacionadas à senha.
  const [passwordError, setPasswordError] = useState('');

  // Controla se o modal está em modo "edição" (true) ou "criação" (false).
  const [isEditing, setIsEditing] = useState(false);
  // Armazena os dados do usuário que está sendo editado no momento.
  const [currentUser, setCurrentUser] = useState(null);

  // --- FUNÇÕES AUXILIARES DE VALIDAÇÃO E FORMATAÇÃO ---

  /**
   * Valida o formato de um email usando uma expressão regular (Regex).
   * @param {string} email - O email a ser validado.
   * @returns {boolean} - Retorna true se o email for válido, false caso contrário.
   */
  const isValidEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  /**
   * Aplica uma máscara de telefone (ex: (11) 99999-9999) enquanto o usuário digita.
   * @param {string} text - O texto digitado pelo usuário.
   * @returns {string} - O texto formatado com a máscara.
   */
  const formatPhoneNumber = (text) => {
    // Remove tudo que não for dígito
    const cleaned = ('' + text).replace(/\D/g, '');
    
    // Aplica a máscara baseando-se no tamanho do número
    let match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    
    match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    
    // Retorna o texto parcialmente formatado enquanto o usuário digita
    if (cleaned.length > 2) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    
    return cleaned;
  };


  // --- FUNÇÕES DE ARMAZENAMENTO LOCAL (AsyncStorage) ---

  // O hook useEffect é usado para executar efeitos colaterais em componentes.
  // Com o array vazio `[]`, esta função roda apenas UMA VEZ, quando o app é aberto.
  useEffect(() => {
    loadUsers();
  }, []);

  // Função assíncrona para carregar os usuários salvos no dispositivo.
  const loadUsers = async () => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      if (usersJson !== null) {
        setUsers(JSON.parse(usersJson)); // Converte a string JSON de volta para um array
      }
    } catch (e) {
      console.error('Falha ao carregar usuários.', e);
    }
  };

  // Função assíncrona para salvar a lista de usuários no dispositivo.
  const saveUsers = async (newUsers) => {
    try {
      const usersJson = JSON.stringify(newUsers); // Converte o array de usuários para uma string JSON
      await AsyncStorage.setItem('users', usersJson);
    } catch (e) {
      console.error('Falha ao salvar usuários.', e);
    }
  };

  // --- FUNÇÕES DE CONTROLE DOS MODAIS E FORMULÁRIOS ---

  // Limpa todos os campos do formulário de usuário e fecha o modal.
  const resetUserForm = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsEditing(false);
    setCurrentUser(null);
    setIsUserModalVisible(false);
  };

  // Limpa todos os campos do formulário de senha e fecha o modal.
  const resetPasswordForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setIsPasswordModalVisible(false);
  };
  
  // --- AÇÕES DO CRUD (Create, Read, Update, Delete) ---

  // Prepara o modal para adicionar um novo usuário.
  const handleAddNewUser = () => {
    setIsEditing(false); // Garante que não está em modo edição
    setIsUserModalVisible(true);
  };

  // Prepara o modal para editar um usuário existente.
  const handleEditUser = (user) => {
    setIsEditing(true); // Ativa o modo edição
    setCurrentUser(user); // Guarda o usuário que está sendo editado
    setNome(user.nome); // Preenche o formulário com os dados atuais
    setEmail(user.email);
    setTelefone(user.telefone);
    setIsUserModalVisible(true);
  };

  // Função chamada ao clicar no botão "Salvar". Decide se deve criar ou editar.
  const handleSaveUser = () => {
    // Validações básicas antes de salvar
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e Email são obrigatórios.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um formato de email válido (ex: email@provedor.com).');
      return;
    }

    if (isEditing) {
      // Lógica de Edição: atualiza os dados do usuário existente
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? { ...user, nome, email, telefone } : user
      );
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    } else {
      // Lógica de Criação: adiciona um novo usuário
      if (!password || password !== confirmPassword) {
        setPasswordError('As senhas não coincidem ou estão em branco.');
        return;
      }
      
      const newUser = {
        id: Date.now().toString(), // Cria um ID único baseado no tempo atual
        nome,
        email,
        telefone, // O telefone já está formatado no estado
        password: password,
      };
      const updatedUsers = [...users, newUser]; // Adiciona o novo usuário à lista existente
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    }
    resetUserForm(); // Limpa e fecha o formulário após salvar
  };
  
  // Exclui um usuário após uma confirmação.
  const handleDeleteUser = (userId) => {
      Alert.alert('Confirmar Exclusão', 'Tem certeza que deseja excluir este usuário?', [
          { text: 'Cancelar' }, // Botão de cancelar não faz nada
          { text: 'Excluir', style: 'destructive', onPress: () => {
              // Filtra a lista, mantendo apenas os usuários com ID diferente do que foi passado
              const updatedUsers = users.filter(user => user.id !== userId);
              setUsers(updatedUsers);
              saveUsers(updatedUsers);
          }}
      ]);
  };
  
  // Atualiza a senha de um usuário no modal específico de senha.
  const handleUpdatePassword = () => {
    if (oldPassword !== currentUser.password) {
      setPasswordError('A senha antiga está incorreta.');
      return;
    }
    if (!newPassword || newPassword !== confirmNewPassword) {
      setPasswordError('As novas senhas não coincidem ou estão em branco.');
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? { ...user, password: newPassword } : user
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    Alert.alert('Sucesso', 'Senha alterada com sucesso!');
    resetPasswordForm(); // Fecha o modal de senha
    resetUserForm();   // Fecha o modal de usuário também
  };

  // --- RENDERIZAÇÃO DOS COMPONENTES VISUAIS ---

  // Define como cada item da lista de usuários será renderizado.
  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View>
        <Text style={styles.userName}>{item.nome}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userPhone}>{item.telefone}</Text>
      </View>
      <View style={styles.cardButtons}>
        <TouchableOpacity onPress={() => handleEditUser(item)} style={{ marginRight: 15 }}>
          <Feather name="edit-2" size={22} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
          <Feather name="trash-2" size={22} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // O `return` define o que será exibido na tela.
  return (
    // SafeAreaView garante que o conteúdo não fique sob as áreas do sistema (ex: notch do iPhone).
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho do aplicativo */}
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Usuários</Text>
        <Button title="Adicionar Usuário" onPress={handleAddNewUser} />
      </View>

      {/* FlatList é o componente otimizado para renderizar listas longas. */}
      <FlatList
        data={users} // A fonte de dados da lista
        renderItem={renderUser} // A função que renderiza cada item
        keyExtractor={(item) => item.id} // Um ID único para cada item
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Modal para Adicionar/Editar Usuário */}
      <Modal visible={isUserModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            {/* Ícone 'X' para fechar/cancelar a operação */}
            <TouchableOpacity style={styles.modalCloseButton} onPress={resetUserForm}>
                <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</Text>
            
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" />
            
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="exemplo@email.com" keyboardType="email-address" autoCapitalize="none" />
            
            <Text style={styles.label}>Telefone</Text>
            {/* O onChangeText aqui chama a função de máscara, que formata o texto e atualiza o estado */}
            <TextInput style={styles.input} value={telefone} onChangeText={(text) => setTelefone(formatPhoneNumber(text))} placeholder="(11) 99999-9999" keyboardType="phone-pad" maxLength={15} />
            
            {/* Renderização condicional: campos de senha aparecem APENAS na criação de usuário */}
            {!isEditing && (
              <>
                <Text style={styles.label}>Senha</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Digite a senha" secureTextEntry />
                
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirme a senha" secureTextEntry />
              </>
            )}

            {/* Mostra mensagem de erro de senha, se houver */}
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Botão "Mudar Senha" aparece APENAS na edição */}
            {isEditing && (
              <View style={{marginTop: 10, width: '100%'}}>
                <Button title="Mudar Senha" onPress={() => setIsPasswordModalVisible(true)} color="#6c757d" />
              </View>
            )}

            <View style={styles.modalButtonRow}>
              <Button title="Salvar" onPress={handleSaveUser} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Mudar Senha */}
      <Modal visible={isPasswordModalVisible} animationType="fade" transparent={true}>
        {/* ... O código deste modal não precisa de alterações, apenas comentários se desejar ... */}
        <View style={styles.modalBackdrop}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Alterar Senha</Text>
                
                <TextInput style={styles.input} value={oldPassword} onChangeText={setOldPassword} placeholder="Senha Antiga" secureTextEntry />
                <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="Nova Senha" secureTextEntry />
                <TextInput style={styles.input} value={confirmNewPassword} onChangeText={setConfirmNewPassword} placeholder="Confirmar Nova Senha" secureTextEntry />

                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                
                <View style={styles.modalButtonRow}>
                  <Button title="Cancelar" onPress={resetPasswordForm} color="red" />
                  <Button title="Confirmar" onPress={handleUpdatePassword} />
                </View>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}